from pydantic_core import PydanticCustomError

def validate_username(username: str) -> str:
    username = username.strip()
    if not username:
        raise PydanticCustomError("value_error", "Username cannot be empty")
    
    if len(username) < 3:
        raise PydanticCustomError("value_error","Username must be at least 3 characters")
    
    if not username.isalnum():
        raise PydanticCustomError("value_error","Username can only contain letters and numbers")
    
    return username

def validate_password(password: str):
    if not password or not password.strip():
        raise PydanticCustomError("value_error","Password cannot be empty")
    
    if len(password) < 8:
        raise PydanticCustomError("value_error","Password must be at least 8 characters")
    
    if len(password) > 72:
        raise PydanticCustomError("value_error","Password cannot be more that 72 characters")
    
    if not any(c.islower() for c in password):
        raise PydanticCustomError("value_error","Password must contain at least one lowercase letter")
    
    if not any(c.isupper() for c in password):
        raise PydanticCustomError("value_error","Password must contain at least one uppercase letter")
    
    if not any(c.isdigit() for c in password):
        raise PydanticCustomError("value_error","Password must contain at least one number")
    
    if not any(not c.isalnum() for c in password):
        raise PydanticCustomError("value_error","Password must contain at least one special character")
    
    return password