from enum import Enum
from app.utils.levels import get_user_level

class UserRole(str, Enum):
    ROOKIE = "Phishing Rookie"
    HUNTER = "Decoy Hunter"
    SHARK = "Digital Shark"
    PREDATOR = "Network Predator"

ROLES_THRESHOLDS: list[tuple[int, UserRole]] = [ #max thresholds for each role
    (3, UserRole.ROOKIE),
    (6, UserRole.HUNTER),
    (9, UserRole.SHARK),
    (10, UserRole.PREDATOR),
]

def get_role_from_level_xp(level: int) -> UserRole:
    for max_level, role in ROLES_THRESHOLDS:
        if level <= max_level:
            return role
        
    return UserRole.PREDATOR

def get_role_from_xp(xp: int) -> UserRole:
    return get_role_from_level_xp(get_user_level(xp))