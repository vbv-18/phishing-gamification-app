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


def get_level(db: Session, level_id: int): #expose the answers
    return db.query(Level).filter(Level.id == level_id).first()

def get_completed_levels(db: Session, user_id: int, level_ids: list[int]) -> set[int]:
    rows = (db.query(LevelProgress.level_id).filter(LevelProgress.user_id == user_id, LevelProgress.level_id.in_(level_ids), LevelProgress.completed == True,).all())

    completed_ids = set()
    for row in rows:
        completed_ids.add(row.level_id)

    return completed_ids


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

def evaluate_signal_classification(questions: list, answers: list) -> int:
    question_map = {}
    for question in questions:
        question_map[question["id"]] = question

    correct = 0
    
    for user_answer in answers:
        question = question_map.get(user_answer.question_id)
        if question is None:
            continue

        if isinstance(user_answer.answer, bool) and user_answer.answer == question["correct_answer"]:
            correct += 1

    return correct

def evaluate_domain_analysis(questions: list, answers: list) -> int: # selection and highlight questions
    question_map = {}
    for question in questions:
        question_map[question["id"]] = question

    corrects = 0

    for user_answer in answers:
        question = question_map.get(user_answer.question_id)
        if question is None:
            continue

        question_type = question.get("type")
        expected = question["correct_answer"]

        if question_type == "selection":
            if isinstance(user_answer.answer, str) and user_answer.answer == expected:
                corrects += 1

        elif question_type == "highlight":
            submitted = user_answer.answer
            if isinstance(submitted, list):
                submitted_list = []
                for s in submitted:
                    submitted_list.append(str(s))

                expected_list = []
                for s in expected:
                    expected_list.append(str(s))

                if sorted(submitted_list) == sorted(expected_list):
                    corrects += 1

    return corrects

def evaluate_answers(level: Level, answers: list) -> int: #chose evaluator based on the exercise type
    exercise_type = level.content.get("exercise_type")
    questions = level.content.get("questions", [])

    if exercise_type == "signal_classification":
        return evaluate_signal_classification(questions, answers)
    
    elif exercise_type == "domain_analysis":
        return evaluate_domain_analysis(questions, answers)
    
    else:
        return 0
    

def complete_level(db: Session, user_id: int, level_id: int, answers: list):
    #level already exists?
    level = db.query(Level).filter(Level.id == level_id).first()
    if not level:
        return None
        
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

    return {"progress": db_progress, "xp_gained": xp_award, "correct_answers": correct_answers, "total_questions": total_questions, "is_perfect": is_perfect}


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
