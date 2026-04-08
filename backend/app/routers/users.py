from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user, verify_password
from app.models.user import User
from app.crud.users import delete_user
from app.crud.xp import get_user_xp
from app.database.connection import get_db
from app.schemas.users import DeleteUserRequest
from app.utils.levels import get_user_level, get_xp_for_next_level
from app.utils.roles import get_role_from_xp

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me") #profile
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/me/xp")
def read_user_xp(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    xp_record = get_user_xp(db, current_user.id)
    xp = xp_record.xp
    level = get_user_level(xp)
    xp_next = get_xp_for_next_level(xp)
    role = get_role_from_xp(xp)

    return {"xp": xp, "level": level, "xp_for_next_level": xp_next, "role": role, "is_max_level": xp_next is None,}

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT) #future: ask for password to delete user
def delete_current_user(request: DeleteUserRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(request.password, current_user.hashed_passwd):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    
    delete_user(db, current_user)

    return