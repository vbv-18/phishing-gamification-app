from passlib.context import CryptContext
import jwt
import secrets
import hashlib
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.refreshToken import RefreshToken
from app.models.access_registry import AccessRegistry
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS

MAX_ATTEMPTS = 5
BLOCK_MINUTES = 15

passwd_context = CryptContext(schemes=["bcrypt"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/signIn")

def hash_password(password: str) -> str: # to hash the user password
    return passwd_context.hash(password)

def hash_refresh_token(token: str) -> str: #for secure token saving
    return hashlib.sha256(token.encode()).hexdigest()

def verify_password(p_password: str, h_password: str) -> bool: #to verify the password
    return passwd_context.verify(p_password, h_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(user_id: int, db: Session) -> str: #generates a random token, saves it hash and returns it
    token = secrets.token_urlsafe(64) #generates token
    token_hash = hash_refresh_token(token)
    expires = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    db_token = RefreshToken(token=token_hash, user_id=user_id, expires=expires, revoked=False)
    db.add(db_token) #saves hashed token
    db.commit()

    return token

def validate_refresh_token(token: str, db: Session) -> User: #validates the token and return the associated user
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    token_hash = hash_refresh_token(token)
    db_token = db.query(RefreshToken).filter(RefreshToken.token == token_hash).first() #search for the hashed token in DB
    if db_token is None or db_token.revoked:
        raise credentials_exception
    
    if db_token.expires < datetime.now(timezone.utc): #token expired
        db_token.revoked = True
        db.commit()
        raise credentials_exception
    
    return db_token.user

def revoke_refresh_token(token: str, db: Session) -> bool:
    token_hash = hash_refresh_token(token)
    db_token = db.query(RefreshToken).filter(RefreshToken.token == token_hash).first()
    if db_token:
        db_token.revoked = True
        db.commit()
        return True
    
    return False

def revoke_all_refresh_tokens(user_id: int, db: Session) -> None: #when user sign out
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id, RefreshToken.revoked == False).update({"revoked": True})
    db.commit()

def clean_refresh_tokens(user_id: int, db: Session) -> None: #remove expired tokens to avoid indefinite saving, done in every user sign in
    now = datetime.now(timezone.utc)
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id, (RefreshToken.revoked == True) | (RefreshToken.expires < now)).delete(synchronize_session=False)

    db.commit()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception

    except Exception:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user

def is_blocked(username: str, db: Session) -> bool:
    record = db.query(AccessRegistry).filter(AccessRegistry.username == username).first()
    if not record:
        return False
    
    if record.blocked_until and record.blocked_until > datetime.now(timezone.utc):
        return True

    if record.blocked_until: #expired block
        db.delete(record)
        db.commit()

    return False

def register_failed(username: str, db: Session) -> None:
    record = db.query(AccessRegistry).filter(AccessRegistry.username == username).first()
    if not record:
        record = AccessRegistry(username=username, count=0, blocked_until=None)
        db.add(record)
    
    record.count += 1
    if record.count >= MAX_ATTEMPTS:
        record.blocked_until = datetime.now(timezone.utc) + timedelta(minutes=BLOCK_MINUTES)

    db.commit()

def clear_attempts(username: str, db: Session) -> None:
    db.query(AccessRegistry).filter(AccessRegistry.username == username).delete()
    db.commit()