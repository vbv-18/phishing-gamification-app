from sqlalchemy.orm import Session
from app.models.level import Level
from app.models.levelProgress import LevelProgress
from app.crud.xp import add_xp, get_user_xp
from app.utils.levels import get_user_level
from app.utils.roles import get_role_from_level
import copy
from typing import Any

def create_level(db: Session, level_data: dict):
    level = Level(**level_data)
    db.add(level)
    db.commit()
    db.refresh(level)

    return level

def get_modules(db: Session):
    return db.query(Level.module).distinct().order_by(Level.module.asc()).all() #if there are 10 modules, 10 will be before 1

def get_level(db: Session, level_id: int): #expose the answers
    return db.query(Level).filter(Level.id == level_id).first()

def get_level_secure(db: Session, level_id: int):
    level = db.query(Level).filter(Level.id == level_id).first()
    if not level:
        return None

    secure_content = copy.deepcopy(level.content) #to avoid modify the original object

    if "questions" in secure_content: #erase correct answers and feedbacks
        for q in secure_content["questions"]:
            q.pop("correct_answer", None)
            q.pop("feedback_correct", None)
            q.pop("feedback_wrong", None)

    return {
        "id": level.id,
        "module": level.module,
        "difficulty": level.difficulty,
        "title": level.title,
        "theory": level.theory,
        "content": secure_content
    }

def get_next_level(db: Session, user_id: int, module_name: str): #return the first level not completed yet
    levels = db.query(Level).filter(Level.module == module_name).order_by(Level.difficulty.asc()).all()
    if not levels:
        return None
    
    level_ids = []
    for level in levels:
        level_ids.append(level.id)

    completed_ids = get_completed_levels(db, user_id, level_ids)

    for level in levels:
        if level.id not in completed_ids:
            return level
    
    return None

def validate_question(level: Level, question_id: int, user_answer: Any): #validate one question by the exercise type
    content = level.content
    exercise_type = content.get("exercise_type")
    questions = content.get("questions", [])

    question = None
    for item in questions:
        if item["id"] == question_id:
            question = item
            break

    if not question:
        return False, "Question not found", None
    
    is_correct = False
    feedback = ""
    correct_answer = question.get("correct_answer")

    if exercise_type in ["hooks_identification", "emotion_identification", "pretext_identification", "file_analysis", "phishing"]:
        is_correct = (user_answer == correct_answer)

    elif exercise_type == "domain_analysis":
        if isinstance(user_answer, list):
            user_ans_sorted = sorted(user_answer)
        else:
            user_ans_sorted = []

        if isinstance(correct_answer, list):
            corr_ans_sorted = sorted(correct_answer)
        else:
            corr_ans_sorted = []

        is_correct = (corr_ans_sorted == user_ans_sorted)
        
    if is_correct:
        feedback = question.get("feedback_correct")
        
    else:
            feedback = question.get("feedback_wrong")

    return is_correct, feedback, correct_answer

def evaluate_answers(level: Level, answers: list) -> int: #chose evaluator based on the exercise type
    correct_count = 0

    for ans in answers:
        is_correct, _, _ = validate_question(level, ans.question_id, ans.answer)
        if is_correct:
            correct_count += 1

    return correct_count

def complete_level(db: Session, user_id: int, level_id: int, answers: list):
    level = get_level(db, level_id)
    if not level:
        return None
    
    #previous state
    xp_before = get_user_xp(db, user_id).xp
    level_xp_before = get_user_level(xp_before)
    role_before = get_role_from_level(level_xp_before)
        
    total_questions = len(level.content.get("questions", []))
    correct_answers = evaluate_answers(level, answers)
    is_perfect = total_questions > 0 and correct_answers == total_questions # to know if the level is completed 100%

    db_progress = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.level_id == level_id).first()

    already_perfect = db_progress is not None and db_progress.completed #user already completed 100% the level
    is_first_attempt = db_progress is None #to give a bonus to the user for completing the level 100% at first attempt

    if already_perfect:
        xp_award = correct_answers * 1 #user redo a level already completed 100%
    elif is_perfect and is_first_attempt:
        xp_award = (correct_answers * 2) + 10 #user complete the level 100% at first attempt
    elif is_perfect and not is_first_attempt:
        xp_award = (correct_answers * 2) + 5 #user complete the level 100% but not at the first attempt
    else:
        xp_award = correct_answers * 2 #user complete the level but not 100% (has mistakes)

    if not db_progress:
        db_progress = LevelProgress(user_id=user_id, level_id=level_id, completed=is_perfect)
        db.add(db_progress)
    elif is_perfect and not already_perfect: #user complete a level 100% when it was not 100%
        db_progress.completed = True
    
    add_xp(db, user_id, xp_award) #xp from the level

    db.commit()
    db.refresh(db_progress)

    #following status
    xp_after = xp_before + xp_award
    level_xp_after = get_user_level(xp_after)
    role_after = get_role_from_level(level_xp_after)

    return {"progress": db_progress,
            "xp_gained": xp_award,
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "is_perfect": is_perfect,
            "level_up": level_xp_after > level_xp_before,
            "new_level": level_xp_after,
            "role_changed": role_after != role_before,
            "new_role": role_after}

def get_completed_levels(db: Session, user_id: int, level_ids: list[int]) -> set[int]:
    rows = (db.query(LevelProgress.level_id).filter(LevelProgress.user_id == user_id, LevelProgress.level_id.in_(level_ids), LevelProgress.completed == True,).all())

    completed_ids = set()
    for row in rows:
        completed_ids.add(row.level_id)

    return completed_ids

def get_levels_by_module(db: Session, module_name: str, user_id: int):
    levels = db.query(Level).filter(Level.module == module_name).order_by(Level.difficulty.asc()).all() #get all the levels from a module

    if not levels:
        return []
    
    level_ids = []
    for level in levels:
        level_ids.append(level.id)

    completed_ids = get_completed_levels(db, user_id, level_ids)

    result = []
    unlocked = True #first level always unlocked

    for level in levels:
        completed = level.id in completed_ids
        result.append({"id": level.id, "title": level.title, "difficulty": level.difficulty, "completed": completed, "unlocked": unlocked})

        if not completed: #next level locked
            unlocked = False

    return result
