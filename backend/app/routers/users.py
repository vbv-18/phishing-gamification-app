from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user, verify_password
from app.models.user import User
from app.crud.users import delete_user
from app.database.connection import get_db
from app.schemas.users import DeleteUserRequest

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me") #profile
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT) #future: ask for password to delete user
def delete_current_user(request: DeleteUserRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(request.password, current_user.hashed_passwd):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    
    delete_user(db, current_user)

    return