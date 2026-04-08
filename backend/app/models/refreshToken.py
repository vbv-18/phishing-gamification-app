from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.connection import Base

class RefreshToken(Base):
    __tablename__ = "refresh_token"

    id = Column(Integer, primary_key=True)
    token = Column(String, unique=True, nullable=False, index=True) #cannot be repeated
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False, nullable=False) #if the token is already revoked
    user = relationship("User", back_populates="refreshTokens")