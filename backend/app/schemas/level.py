from pydantic import BaseModel
from typing import Any

class TheoryItem(BaseModel):
    concept: str
    definition: str

class TheorySection(BaseModel):
    id: int
    title: str
    description: str
    items: list[TheoryItem]

class ModuleTheoryResponse(BaseModel):
    module_id: int
    title: str
    theory: list[TheorySection]

    model_config = {"from_attributes": True}

class ModuleListItem(BaseModel):
    id: int
    title: str
    all_completed: bool
    theory: list[TheorySection]
    theory_seen: bool

    model_config = {"from_attributes": True}

class LevelBase(BaseModel):
    module_id: int
    difficulty: int
    title: str
    content: Any

class LevelResponse(LevelBase):
    id: int

    model_config = {"from_attributes": True}

class LevelList(BaseModel):
    id: int
    title: str
    difficulty: int
    completed: bool
    unlocked: bool

    model_config = {"from_attributes": True}

class ModuleLevelsResponse(BaseModel):
    theory_seen: bool
    levels: list[LevelList]

class UserAnswer(BaseModel):
    question_id: int
    answer: Any

class CheckUserAnswerRequest(BaseModel):
    question_id: int
    answer: Any

class CheckAUserAnswerResponse(BaseModel):
    correct: bool
    feedback: str

class CompleteLevelRequest(BaseModel):
    answers: list[UserAnswer]