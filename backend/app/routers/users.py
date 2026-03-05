from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.models.user import User
from app.crud.users import delete_user
from app.database.connection import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me") #profile
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT) #future: ask for password to delete user
def delete_current_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_user(db, current_user)

    return