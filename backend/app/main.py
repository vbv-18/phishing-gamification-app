from fastapi import FastAPI
from app.routers import auth, users, levels
from app.database.connection import Base, engine
from contextlib import asynccontextmanager
from app.utils.errors import setup_exception_handlers
from app.core.middleware import register_security_middleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine) 
    yield

app = FastAPI(title="AppAPI", lifespan=lifespan) #session generator

register_security_middleware(app)
setup_exception_handlers(app)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(levels.router)

@app.get("/") #root
def root():
    return {"message": "API working!" }