import { Question } from "./exercise";

export interface LevelContent{
    instructions: string;
    mechanic: string;
    questions: Question[];
}

export interface Level{
    id: number;
    module: string;
    content: LevelContent;
}