from pydantic import BaseModel
from typing import Any

class LevelBase(BaseModel):
    module: str
    difficulty: int
    title: str
    theory: Any
    content: Any

class LevelResponse(LevelBase):
    id: int

    class Config:
        orm_mode = True

class LevelList(BaseModel):
    id: int
    title: str
    difficulty: int
    completed: bool
    unlocked: bool

    class Config:
        orm_mode = True

class UserAnswer(BaseModel):
    question_id: int
    answer: Any

# signal_classification -> bool
# domain_analysis selection -> domain string chosen
# domain_analysis highlight -> segment list marked as suspicious

class CompleteLevelRequest(BaseModel):
    answers: list[UserAnswer]