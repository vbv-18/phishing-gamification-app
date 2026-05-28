from sqlalchemy.orm import Session
from app.models.level import Level
from app.models.module import Module
from app.models.levelProgress import LevelProgress
from app.models.theoryProgress import TheoryProgress
from app.crud.xp import add_xp, get_user_xp
from app.utils.levels import get_user_level
from app.utils.roles import get_role_from_level
from app.utils.badges import get_badge5
import copy
from typing import Any

def create_module(db: Session, module_data: dict):
    module = Module(id=module_data['module_id'], title=module_data['title'], theory=module_data['theory'])
    db.add(module)
    db.commit()
    db.refresh(module)

    return module

def create_level(db: Session, level_data: dict):
    level = Level(module_id=int(level_data['module_id']), module_level=level_data['module_level'], difficulty=int(level_data['difficulty']), title=str(level_data['title']), content=level_data['content'])
    db.add(level)
    db.commit()
    db.refresh(level)

    return level

def get_module(db: Session, module_id: int, user_id: int):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        return None
    
    levels_data = get_levels_by_module(db, module_id, user_id)
    if not levels_data:
        all_completed = False
        theory_seen = seen_theory(db, user_id, module_id)

    else:
        theory_seen = levels_data["theory_seen"]
        all_completed = all(level["completed"] for level in levels_data["levels"])

    return {
        "id": module.id,
        "title": module.title,
        "all_completed": all_completed,
        "theory": module.theory or [],
        "theory_seen": theory_seen,
    }

def get_modules(db: Session, user_id: int):
    modules =  db.query(Module).order_by(Module.id.asc()).all()

    return [get_module(db, module.id, user_id) for module in modules]

def get_module_theory(db: Session, module_id: int):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        return None
    
    return {"module_id": module.id, "title": module.title, "theory": module.theory or []}

def get_level(db: Session, module_id: int, module_level: int): #expose the answers
    return db.query(Level).filter(Level.module_id == module_id, Level.module_level == module_level).first()

def get_level_secure(db: Session, module_id: int, module_level: int):
    level = get_level(db, module_id, module_level)
    if not level:
        return None

    secure_content = copy.deepcopy(level.content) #to avoid modify the original object

    if "questions" in secure_content: #erase correct answers and feedbacks
        for q in secure_content["questions"]:
            q.pop("correct_answer", None)
            q.pop("feedback_correct", None)
            q.pop("feedback_wrong", None)

    return {
        "id": level.module_level,
        "module_id": level.module_id,
        "difficulty": level.difficulty,
        "title": level.title,
        "content": secure_content
    }

def get_levels_by_module(db: Session, module_id: int, user_id: int):
    levels = db.query(Level).filter(Level.module_id == module_id).order_by(Level.module_level.asc()).all() #get all the levels from a module

    if not levels:
        return None #module not found != module without levels
    
    level_ids = []
    for level in levels:
        level_ids.append(level.id)

    completed_ids = get_completed_levels(db, user_id, level_ids)
    theory_seen = seen_theory(db, user_id, module_id)

    result = []
    unlocked = theory_seen #levels unlocked if theory not seen yet

    for level in levels:
        completed = level.id in completed_ids
        result.append({"id": level.module_level, "title": level.title, "difficulty": level.difficulty, "completed": completed, "unlocked": unlocked})

        if not completed: #next level locked
            unlocked = False

    return {"theory_seen": theory_seen, "levels": result}

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

    if exercise_type in ["hooks_identification", "emotion_identification", "pretext_identification", "file_analysis", "simulation", "steps_sorted", "report_match", "protection_choice"]:
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

def complete_level(db: Session, user_id: int, module_id: int, module_level: int, answers: list):
    level = get_level(db, module_id, module_level)
    if not level:
        return None
    
    real_id = level.id
    
    #previous state
    xp_before = get_user_xp(db, user_id).xp
    level_xp_before = get_user_level(xp_before)
    role_before = get_role_from_level(level_xp_before)
    completed_count_before = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.completed == True).count() #for new badges
        
    total_questions = len(level.content.get("questions", []))
    correct_answers = evaluate_answers(level, answers)
    is_perfect = total_questions > 0 and correct_answers == total_questions # to know if the level is completed 100%

    db_progress = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.level_id == real_id).first()

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
        db_progress = LevelProgress(user_id=user_id, level_id=real_id, completed=is_perfect)
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
    completed_count_after = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.completed == True).count()
    new_badge5 = get_badge5(completed_count_before, completed_count_after)

    return {
            "xp_gained": xp_award,
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "is_perfect": is_perfect,
            "completed": db_progress.completed,
            "level_up": level_xp_after > level_xp_before,
            "new_level": level_xp_after,
            "role_changed": role_after != role_before,
            "new_role": role_after,
            "new_badge": new_badge5,
            }

def get_theory(db: Session, user_id: int, module_id: int):
    return db.query(TheoryProgress).filter(TheoryProgress.user_id == user_id, TheoryProgress.module_id == module_id).first()

def seen_theory(db: Session, user_id: int, module_id: int) -> bool:
    row = get_theory(db, user_id, module_id)

    return bool(row and row.seen)

def mark_theory_seen(db: Session, user_id: int, module_id: int):
    xp_before = get_user_xp(db, user_id).xp
    level_xp_before = get_user_level(xp_before)
    role_before = get_role_from_level(level_xp_before)

    db_progress = get_theory(db, user_id, module_id)
    already_seen = db_progress is not None and db_progress.seen

    if already_seen:
        xp_award = 0
    else:
        xp_award = 20

    if not db_progress:
        db_progress = TheoryProgress(user_id=user_id, module_id=module_id, seen=True)
        db.add(db_progress)
    elif not already_seen:
        db_progress.seen = True

    if xp_award > 0:
        add_xp(db, user_id, xp_award)

    db.commit()
    db.refresh(db_progress)

    xp_after = xp_before + xp_award
    level_xp_after = get_user_level(xp_after)
    role_after = get_role_from_level(level_xp_after)

    return {
        "theory_seen": db_progress.seen,
        "xp_gained": xp_award,
        "level_up": level_xp_after > level_xp_before,
        "new_level": level_xp_after,
        "role_changed": role_after != role_before,
        "new_role": role_after
    }

def get_completed_levels(db: Session, user_id: int, level_ids: list[int]) -> set[int]:
    rows = (db.query(LevelProgress.level_id).filter(LevelProgress.user_id == user_id, LevelProgress.level_id.in_(level_ids), LevelProgress.completed == True,).all())

    completed_ids = set()
    for row in rows:
        completed_ids.add(row.level_id)

    return completed_ids

def is_level_unlocked(db: Session, user_id: int, module_id: int, module_level: int) -> bool:
    target_level = get_level(db, module_id, module_level)
    if not target_level:
        return False
    
    if not seen_theory(db, user_id, target_level.module_id): #theory always seen first
        return False
    
    previous_levels = (db.query(Level).filter(Level.module_id == target_level.module_id, Level.module_level < target_level.module_level)).all() #level unlocked if all previous completed
    if not previous_levels:
        return True
    
    prev_ids = []
    for level in previous_levels:
        prev_ids.append(level.id)

    completed_ids = get_completed_levels(db, user_id, prev_ids)

    for lid in prev_ids:
        if lid not in completed_ids:
            return False
        
    return True