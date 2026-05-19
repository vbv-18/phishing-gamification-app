from app.utils.levels import get_user_level

def get_unlocked_badges(xp: int, completed_levels_count: int) -> list[str]: #calculate the badges corresponding to the user according to his xp and completed levels
    unlocked = []
    level = get_user_level(xp)

    unlocked.append('badge1') #only for register

    if level >= 4: #second role: Decoy Hunter
        unlocked.append('badge2')

    if level >= 7: #third role: Digital Shark
        unlocked.append('badge3')

    if level >= 10: #fourth role: Network Predator
        unlocked.append('badge4')

    if completed_levels_count >= 3: #for completing 3 or more levels
        unlocked.append('badge5')

    return unlocked