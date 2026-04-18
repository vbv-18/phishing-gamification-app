import { LevelState } from "@/hooks/useLevelState";
import { Question } from "./exercise";

export interface ExerciseRenderProps{
    instructions: string;
    question: Question;
    levelState: LevelState;
}