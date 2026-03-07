from sqlalchemy.orm import Session
from app.models.level import Level
from app.models.levelProgress import LevelProgress
from app.crud.xp import add_xp

def create_level(db: Session, level_data: dict):
    level = Level(**level_data)
    db.add(level)
    db.commit()
    db.refresh(level)

    return level


def get_level(db: Session, level_id: int):
    return db.query(Level).filter(Level.id == level_id).first()


def get_next_level(db: Session, user_id: int, module_name: str): #return the first level not completed
    levels = db.query(Level).filter(Level.module == module_name).order_by(Level.difficulty.asc()).all()
    if not levels:
        return None
    
    for level in levels:
        progress = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.level_id == level.id, LevelProgress.completed == True).first()

        if not progress:
            return level
    
    return None


def complete_level(db: Session, user_id: int, level_id: int, correct_answers: int):
    #level already exists?
    level = db.query(Level).filter(Level.id == level_id).first()
    if not level:
        return None
    
    db_progress = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.level_id == level_id).first()
    if not db_progress:
        db_progress = LevelProgress(user_id=user_id, level_id=level_id, completed=True)
        db.add(db_progress)
    else:
        db_progress.completed = True

    xp_award = correct_answers * 5 #5XP for correct answer

    xp_record = add_xp(db, user_id, xp_award) #xp from the level

    db.commit()
    db.refresh(db_progress)
    db.refresh(xp_record)

    return {"progress": db_progress, "xp_gained": xp_award}


def get_levels_by_module(db: Session, module_name: str, user_id: int):
    levels = db.query(Level).filter(Level.module == module_name).order_by(Level.difficulty.asc()).all() #get all the levels from a module

    result = []
    unlocked = True #first level always unlocked

    for level in levels:
        progress = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.level_id == level.id, LevelProgress.completed == True).first()
        completed = progress is not None

        result.append({"id": level.id, "title": level.title, "difficulty": level.difficulty, "completed": completed, "unlocked": unlocked})

        if not completed: #next level locked
            unlocked = False

    return result
