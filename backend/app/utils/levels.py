from dataclasses import dataclass

@dataclass(frozen=True)
class LevelThreshold:
    level: int
    xp_required: int

LEVEL_THRESHOLDS: list[LevelThreshold] = [
    LevelThreshold(1, 0),
    LevelThreshold(2, 15),
    LevelThreshold(3, 35),
    LevelThreshold(4, 60),
    LevelThreshold(5, 90),
    LevelThreshold(6, 125),
    LevelThreshold(7, 165),
    LevelThreshold(8, 210),
    LevelThreshold(9, 260),
    LevelThreshold(10, 315),
]

def get_user_level(xp: int) -> int: #returns the user's current level based on accumulated XP
    current_level = 1 #start level
    for threshold in LEVEL_THRESHOLDS:
        if xp >= threshold.xp_required:
            current_level = threshold.level

    return current_level

def get_xp_for_next_level(xp: int) -> int | None: #return xp required for the next level, or None if at max level
    current_level = get_user_level(xp)
    for threshold in LEVEL_THRESHOLDS:
        if threshold.level == current_level + 1:
            return threshold.xp_required
        
    return None
