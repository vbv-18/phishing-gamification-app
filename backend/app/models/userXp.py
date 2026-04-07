from sqlalchemy import Column, Integer, ForeignKey
from app.database.connection import Base

class UserXp(Base):
    __tablename__= "user_xp"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)#same user cannot appear multiple times in the table
    xp = Column(Integer, default=0, nullable=False)