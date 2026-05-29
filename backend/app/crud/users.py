from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.users import UserCreate
from app.core.security import hash_password

def create_user(db: Session, user: UserCreate) -> User: #create an user
    hashed_password = hash_password(user.password)
    db_user = User(username=user.username, email=user.email, hashed_passwd=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def delete_user(db: Session, user: User): #delete user
    db.delete(user)
    db.commit()