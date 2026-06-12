from pydantic import BaseModel, EmailStr, field_validator
from .validators import validate_username, validate_password

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator('username')
    @classmethod
    def username_valid(cls, u):
        return validate_username(u)
    
    @field_validator('password')
    @classmethod
    def password_valid(cls, p):
        return validate_password(p)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str

    model_config = {"from_attributes": True}

class DeleteUserRequest(BaseModel):
    password: str