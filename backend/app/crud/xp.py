from sqlalchemy.orm import Session
from app.models.userXp import UserXp

def get_user_xp(db: Session, user_id: int):
    xp_record = db.query(UserXp).filter(UserXp.user_id == user_id).first() #xp obtain by the user
    if not xp_record:
        xp_record = UserXp(user_id=user_id, xp=0) #if does not exist yet
        db.add(xp_record)
        db.flush()

    return xp_record

def add_xp(db: Session, user_id: int, points: int):
    xp_record = get_user_xp(db, user_id)
    xp_record.xp += points

    return xp_record