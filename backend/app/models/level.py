from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from app.database.connection import Base
from sqlalchemy.orm import relationship


class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False) 
    difficulty = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content = Column(JSON, nullable=False)

    module = relationship("Module", back_populates="levels")