from sqlalchemy import Column, Integer, Boolean, ForeignKey, UniqueConstraint
from app.database.connection import Base

class TheoryProgress(Base):
    __tablename__ = "theory_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    seen = Column(Boolean, default=False, nullable=False) #unlock the rest of the levels

    __table_args__ = (UniqueConstraint("user_id", "module_id", name="unique_theory_user_module"),) #user can appear multiple times in the table if is with different modules