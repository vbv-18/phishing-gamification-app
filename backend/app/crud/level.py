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
        
    correct_answers = evaluate_answers(level, answers)

    db_progress = db.query(LevelProgress).filter(LevelProgress.user_id == user_id, LevelProgress.level_id == level_id).first()

    already_completed = db_progress is not None and db_progress.completed

    if not db_progress:
        db_progress = LevelProgress(user_id=user_id, level_id=level_id, completed=True)
        db.add(db_progress)
    else:
        db_progress.completed = True

    xp_award = 0
    
    if not already_completed:
        xp_award = correct_answers * 5 #5XP for correct answer
        add_xp(db, user_id, xp_award) #xp from the level

    db.commit()
    db.refresh(db_progress)

    return {"progress": db_progress, "xp_gained": xp_award, "correct_answers": correct_answers}


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
