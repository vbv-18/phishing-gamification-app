from sqlalchemy import Column, Integer, Boolean, ForeignKey, UniqueConstraint
from app.database.connection import Base

class LevelProgress(Base):
    __tablename__ = "level_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    level_id = Column(Integer, ForeignKey("levels.id", ondelete="CASCADE"), nullable=False)
    completed = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "level_id", name="unique_user_level"), #user can appear multiple times in the table if is with different levels
    )
