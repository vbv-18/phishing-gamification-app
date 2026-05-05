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