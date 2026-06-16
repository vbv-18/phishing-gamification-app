import { createContext, useContext, useState } from 'react';
import { UserAnswer } from '@/services/api';

interface LevelAnswersContextType {
    answers: UserAnswer[];
    totalQuestions: number;
    setLevelAnswers: (answers: UserAnswer[], total: number) => void;
    clear: () => void;
}

const LevelAnswersContext = createContext<LevelAnswersContextType | null>(null);

export function LevelAnswersProvider({ children }: { children: React.ReactNode }){
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const setLevelAnswers = (a: UserAnswer[], total: number) => {
        setAnswers(a);
        setTotalQuestions(total);
    };

    const clear = () => {
        setAnswers([]);
        setTotalQuestions(0);
    };

    return (
        <LevelAnswersContext.Provider value={{ answers, totalQuestions, setLevelAnswers, clear }}>
            {children}
        </LevelAnswersContext.Provider>
    );
}

export function useLevelAnswers() {
    const ctx = useContext(LevelAnswersContext);
    if (!ctx) throw new Error('useLevelAnswers must be used inside LevelAnswersProvider');
    return ctx;
}