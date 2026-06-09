from sqlalchemy import Column, Integer, String, JSON
from app.database.connection import Base
from sqlalchemy.orm import relationship


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False) 
    theory = Column(JSON, nullable=True)

    levels = relationship("Level", back_populates="module", cascade="all, delete-orphan")
