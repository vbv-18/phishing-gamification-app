from pydantic import BaseModel
from typing import Any

class LevelBase(BaseModel):
    module: str
    difficulty: int
    title: str
    theory: Any
    content: Any
    feedback: Any
    points: int

class LevelResponse(LevelBase):
    id: int

    class Config:
        orm_mode = True