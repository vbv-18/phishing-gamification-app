from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.schemas.users import UserCreate, UserResponse
from app.database.connection import get_db
from app.models.user import User
from app.schemas.token import Token, RefreshRequest
from app.crud.users import create_user
from app.core.security import verify_password, create_access_token, create_refresh_token, validate_refresh_token, revoke_refresh_token, revoke_all_refresh_tokens, get_current_user, clean_refresh_tokens

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/signIn")

@router.post("/signUp", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(User.email == user.email).first()
    existing_username = db.query(User).filter(User.username == user.username).first()

    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The email already exists")
    
    elif existing_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The username already exists")
    
    new_user = create_user(db, user)

    return new_user

@router.post("/signIn", response_model=Token)
def login_user(login_req: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_req.username).first()

    if not user or not verify_password(login_req.password, user.hashed_passwd):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    clean_refresh_tokens(user.id, db) #clean obsolete tokens before create news
    
    access_token = create_access_token({"sub": user.username})
    refresh_token = create_refresh_token(user.id, db)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
def refresh_token(body: RefreshRequest, db: Session = Depends(get_db)): #rotation tokens
    user = validate_refresh_token(body.refresh_token, db)

    revoke_refresh_token(body.refresh_token, db)
    access_token = create_access_token({"sub": user.username})
    new_refresh_token = create_refresh_token(user.id, db)

    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

@router.post("/signOut")
def signOut_tokens(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    revoke_all_refresh_tokens(current_user.id, db)
    return {"detail": "Successfully sign out"}