import { Question } from "./exercise";

export interface LevelContent{
    instructions: string;
    mechanic: string;
    questions: Question[];
}

export interface LevelSummary{
    id: number;
    title: string;
    difficulty: number;
    completed: boolean;
    unlocked: boolean;
}

export interface Level{
    id: number;
    title: string;
    module_id: number;
    difficulty: number;
    content: LevelContent;
}

export interface LevelProgress{
    id: number;
    user_id: number;
    level_id: number;
    completed: boolean;
}

export interface CompleteLevelResponse{
    message: string;
    progress: LevelProgress;
    xp_gained: number;
    correct_answers: number;
    total_questions: number;
    is_perfect: boolean;
    level_up: boolean;
    new_level: number;
    role_changed: boolean;
    new_role: string;
    new_badge: string | null; // badge5 or null
}

export interface CompleteTheoryResponse{
    message: string;
    theory_seen: boolean;
    xp_gained: number;
    level_up: boolean;
    new_level: number;
    role_changed: boolean;
    new_role: string; 
}