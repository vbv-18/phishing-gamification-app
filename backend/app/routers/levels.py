from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.security import get_current_user
from app.schemas.level import LevelResponse, LevelList
from app.crud.level import get_level, get_next_level, complete_level, get_levels_by_module

router = APIRouter(prefix="/levels", tags=["Levels"])

@router.get("/module/{module_name}/next", response_model=LevelResponse) #if continue button?
def read_next_level(module_name: str, db: Session = Depends(get_db), user = Depends(get_current_user)):
    next_level = get_next_level(db, user.id, module_name)
    if not next_level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No levels available")
    
    return next_level

@router.get("/{level_id}", response_model=LevelResponse)
def read_level(level_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    level = get_level(db, level_id)
    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")
    
    return level

@router.get("/module/{module_name}", response_model=list[LevelList])
def read_levels_by_module(module_name: str, db: Session = Depends(get_db), user = Depends(get_current_user)):
    levels = get_levels_by_module(db, module_name, user.id)

    if not levels:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    
    return levels

@router.post("/{level_id}/complete") #for backend can mark a level completed
def mark_level_completed(level_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    progress = complete_level(db, user.id, level_id)

    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "Level not found")
    
    return {"message": "Level completed"}


