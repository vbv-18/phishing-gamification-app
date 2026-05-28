from sqlalchemy import Column, String, Integer, DateTime
from app.database.connection import Base

class AccessRegistry(Base):
    __tablename__ = 'access_registry'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False, index=True) #future -> also by ip_address
    count = Column(Integer, default=0, nullable=False)
    blocked_until = Column(DateTime(timezone=True), nullable=True)