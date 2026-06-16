from sqlalchemy import Column, Integer, String, JSON, ForeignKey, UniqueConstraint
from app.database.connection import Base
from sqlalchemy.orm import relationship


class Level(Base):
    __tablename__ = "levels"

    id = Column(Integer, primary_key=True)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    module_level = Column(Integer, nullable=False) #own level id inside each module
    difficulty = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content = Column(JSON, nullable=False)

    module = relationship("Module", back_populates="levels")

    __table_args__ = (UniqueConstraint("module_id", "module_level", name="unique_module_level_module"),) #not repeated levels in one module