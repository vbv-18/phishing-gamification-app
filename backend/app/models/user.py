from sqlalchemy import Column, Integer, String
from app.database.connection import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False) 
    email = Column(String, unique=True)
    hashed_passwd = Column(String)
    refreshTokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan") #one user can have many tokens (1:N)
