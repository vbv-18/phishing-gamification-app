from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base() #to define models

def get_db(): #to obtain the db session in each request
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
