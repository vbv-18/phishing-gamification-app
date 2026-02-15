from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.schemas.users import UserCreate, UserResponse, LoginRequest
from app.database.connection import get_db
from app.models.user import User
from app.crud.users import create_user
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_sheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(User.email == user.email).first()
    existing_username = db.query(User).filter(User.username == user.username).first()

    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The email already exists")
    
    elif existing_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The username already exists")
    
    new_user = create_user(db, user)

    return new_user

@router.post("/login")
def login_user(login_req: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_req.username).first()

    if not user or not verify_password(login_req.password, user.hashed_passwd):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}
