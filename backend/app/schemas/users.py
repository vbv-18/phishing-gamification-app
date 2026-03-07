from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    username: str
    password: str

class DeleteUserRequest(BaseModel):
    password: str