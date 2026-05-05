from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.security import get_current_user
from app.schemas.level import LevelResponse, LevelList, CompleteLevelRequest, CheckUserAnswerRequest, CheckAUserAnswerResponse
from app.crud.level import get_modules, get_level, get_level_secure, get_next_level, complete_level, get_levels_by_module, validate_question

router = APIRouter(prefix="/levels", tags=["Levels"])

@router.get("/modules")
def read_modules(db: Session = Depends(get_db), user = Depends(get_current_user)):
    modules = get_modules(db)
    if not modules:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No modules found")
    
    return modules

@router.get("/{level_id}", response_model=LevelResponse)
def read_level(level_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    level = get_level_secure(db, level_id)
    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")
    
    return level

@router.get("/module/{module_id}/next", response_model=LevelResponse) #if continue button?
def read_next_level(module_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    next_level = get_next_level(db, user.id, module_id)
    if not next_level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No levels available")
    
    return get_level_secure(db, next_level.id)

@router.get("/module/{module_id}", response_model=list[LevelList])
def read_levels_by_module(module_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    levels = get_levels_by_module(db, module_id, user.id)

    if not levels:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    
    return levels

@router.post("/{level_id}/check-answer", response_model=CheckAUserAnswerResponse)
def check_question(level_id: int, request: CheckUserAnswerRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    level = get_level(db, level_id) #level with answers
    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")
    
    is_correct, feedback, _ = validate_question(level, request.question_id, request.answer)

    return {"correct": is_correct, "feedback": feedback}

@router.post("/{level_id}/complete") #receive answers, evaluates them, mark level as completed and awards XP
def mark_level_completed(level_id: int, answers: CompleteLevelRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    progress = complete_level(db, user.id, level_id, answers.answers)

    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "Level not found")
    
    return {"message": "Level completed", **progress}


