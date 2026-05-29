from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.schemas.users import UserCreate, UserResponse
from app.database.connection import get_db
from app.models.user import User
from app.schemas.token import Token, RefreshRequest
from app.crud.users import create_user
from app.core.security import verify_password, create_access_token, create_refresh_token, validate_refresh_token, revoke_refresh_token, revoke_all_refresh_tokens, check_user_exists, get_current_user, clean_refresh_tokens, is_blocked, register_failed, clear_attempts
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signUp", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = check_user_exists(db, user.email, user.username)

    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    
    new_user = create_user(db, user)

    return new_user

@router.post("/signIn", response_model=Token)
def login_user(login_req: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = login_req.username

    if is_blocked(username, db):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail='Too many failed attempts. Try again later')
        
    user = db.query(User).filter(User.username == username).first()

    if not user or not verify_password(login_req.password, user.hashed_passwd):
        register_failed(username, db)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    clear_attempts(username, db)
    clean_refresh_tokens(user.id, db) #clean obsolete tokens before create news
    
    access_token = create_access_token({"sub": user.id}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_refresh_token(user.id, db)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
def refresh_token(body: RefreshRequest, db: Session = Depends(get_db)): #rotation tokens
    user = validate_refresh_token(body.refresh_token, db)

    revoke_refresh_token(body.refresh_token, db)
    access_token = create_access_token({"sub": user.id},expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    new_refresh_token = create_refresh_token(user.id, db)

    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

@router.post("/signOut")
def signOut_tokens(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    revoke_all_refresh_tokens(current_user.id, db) #access token not revoked
    return {"detail": "Successfully sign out"}