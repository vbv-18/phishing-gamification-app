from sqlalchemy.orm import Session
from app.models.level import Level

def create_level(db: Session, level_data: dict):
    level = Level(**level_data)
    db.add(level)
    db.commit()
    db.refresh(level)

    return level

def get_level(db: Session, level_id: int):
    return db.query(Level).filter(Level.id == level_id).first()

def get_next_level(db: Session): #for now return the level with less difficulty
    return db.query(Level).order_by(Level.difficulty.asc()).first()