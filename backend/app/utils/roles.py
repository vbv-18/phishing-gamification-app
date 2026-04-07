from enum import Enum
from app.utils.levels import get_user_level

class UserRole(str, Enum):
    ROOKIE = "Phishing Rookie"
    HUNTER = "Decoy Hunter"
    SHARK = "Digital Shark"
    PREDATOR = "Network Predator"

ROLES_THRESHOLDS: list[tuple[int, UserRole]] = [ #max thresholds for each role
    (3, UserRole.ROOKIE), #levels 1-3
    (6, UserRole.HUNTER), #levels 4-6
    (9, UserRole.SHARK), #levels 7-9
    (10, UserRole.PREDATOR), # level 10
]

def get_role_from_level(level: int) -> UserRole: #returns the role that corresponds to XP level
    for max_level, role in ROLES_THRESHOLDS:
        if level <= max_level:
            return role
        
    return UserRole.PREDATOR

def get_role_from_xp(xp: int) -> UserRole: #derives role from XP directly
    return get_role_from_level(get_user_level(xp))