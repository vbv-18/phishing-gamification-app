from sqlalchemy import Column, Integer, String, JSON
from app.database.connection import Base

class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True)
    module = Column(String, nullable=False) 
    difficulty = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    theory = Column(JSON, nullable=True)
    content = Column(JSON, nullable=False)
    points = Column(Integer, default=10, nullable=False)
