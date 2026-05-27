export interface LoginResponse{
    access_token: string;
    refresh_token: string;
    token_type: 'bearer';
}

export interface RegisterResponse{
    id: number;
    username: string;
    email: string;
}

export interface UserXpData{
    xp: number;
    level: number;
    xp_for_next_level: number | null;
    role: string;
    is_max_level: boolean;
    unlocked_badges: string[]; 
}

export interface ProfileData{
    id: number;
    username: string;
    email: string;
}