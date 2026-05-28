from fastapi import HTTPException

def validate_username(username: str) -> str:
    username = username.strip()
    if not username:
        raise HTTPException(400, "Username cannot be empty")
    
    if len(username) < 3:
        raise HTTPException(400, "Username must be at least 3 characters")
    
    if not username.isalnum():
        raise HTTPException(400, "Username can only contain letters and numbers")
    
    return username

def validate_password(password: str):
    if not password or not password.strip():
        raise HTTPException(400, "Password cannot be empty")
    
    if len(password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    
    if len(password) > 72:
        raise HTTPException(400, "Password cannot be more that 72 characters")
    
    if not any(c.islower() for c in password):
        raise HTTPException(400, "Password must contain at least one lowercase letter")
    
    if not any(c.isupper() for c in password):
        raise HTTPException(400, "Password must contain at least one uppercase letter")
    
    if not any(c.isdigit() for c in password):
        raise HTTPException(400, "Password must contain at least one number")
    
    if not any(not c.isalnum() for c in password):
        raise HTTPException(400, "Password must contain at least one special character")
    
    return password