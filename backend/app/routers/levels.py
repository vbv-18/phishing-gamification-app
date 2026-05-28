from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.security import get_current_user
from app.schemas.level import LevelResponse, CompleteLevelRequest, CheckUserAnswerRequest, CheckAUserAnswerResponse, ModuleLevelsResponse, ModuleListItem, ModuleTheoryResponse
from app.crud.level import get_module, get_modules, get_module_theory, get_level, get_level_secure, complete_level, get_levels_by_module, validate_question, mark_theory_seen, is_level_unlocked

router = APIRouter(prefix="/modules", tags=["Modules"])

@router.get("", response_model=list[ModuleListItem])
def read_modules(db: Session = Depends(get_db), user = Depends(get_current_user)):
    modules = get_modules(db, user.id)
    if not modules:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No modules found")
    
    return modules

@router.get("/{module_id}", response_model=ModuleListItem)
def read_levels_by_module(module_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    module = get_module(db, module_id, user.id)

    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    
    return module

@router.get("/{module_id}/theory", response_model=ModuleTheoryResponse) #for the future, not using it right now
def read_module_theory(module_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    theory = get_module_theory(db, module_id)
    if not theory:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    return theory

@router.post("/{module_id}/theory/complete")
def complete_theory(module_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    theory = get_module_theory(db, module_id)
    if not theory:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theory not found")
    
    progress_data = mark_theory_seen(db, user.id, module_id)
    return {"message": "Theory completed", **progress_data}

@router.get("/{module_id}/levels", response_model=ModuleLevelsResponse)
def read_level(module_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    data = get_levels_by_module(db, module_id, user.id)

    if data is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Levels not found")
    
    return data

@router.get("/{module_id}/levels/{level_id}", response_model=LevelResponse)
def read_level(module_id: int, level_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    level = get_level_secure(db, module_id, level_id)
    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")
    
    if not is_level_unlocked(db, user.id, module_id, level_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Level not unlocked")
    
    return level


@router.post("/{module_id}/levels/{level_id}/check-answer", response_model=CheckAUserAnswerResponse)
def check_answer(module_id: int, level_id: int, request: CheckUserAnswerRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    level = get_level(db, module_id, level_id) #level with answers
    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")
    
    if not is_level_unlocked(db, user.id, module_id, level_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Level not unlocked")
    
    is_correct, feedback, _ = validate_question(level, request.question_id, request.answer)

    return {"correct": is_correct, "feedback": feedback}

@router.post("/{module_id}/levels/{level_id}/complete") #receive answers, evaluates them, mark level as completed and awards XP
def mark_level_completed(module_id: int, level_id: int, answers: CompleteLevelRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    level = get_level(db, module_id, level_id)
    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level not found")
    
    if not is_level_unlocked(db, user.id, module_id, level_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Level not unlocked")
    
    progress = complete_level(db, user.id, module_id, level_id, answers.answers)

    if not progress:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "Level not found")
    
    return {"message": "Level completed", **progress}


