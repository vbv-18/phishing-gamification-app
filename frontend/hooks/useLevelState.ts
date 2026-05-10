import { Animated } from "react-native";
import { useEffect, useState } from "react";
import { UserAnswer } from "@/services/api";
import { checkAnswer } from "@/services/api";
import { Level } from "@/types/level";

export interface LevelState{
  currentIndex: number;
  showFeedback: boolean;
  isCorrect: boolean | null;
  serverFeedback: string;
  finished: boolean;
  collectedAnswers: UserAnswer[];
  progressAnimation: Animated.Value;
  isChecking: boolean;

  submitAnswer: (questionId: number, answer: boolean | string |string [] | Record<string, string>) => Promise<void>;
  handleContinue: () => void;  
}

export function useLevelState(level: Level | null): LevelState{
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [serverFeedback, setServerFeedback] = useState("");
    const [progressCount, setProgressCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [collectedAnswers, setCollectedAnswers] = useState<UserAnswer[]>([]);
    const [isChecking, setIsChecking] = useState(false); //if the button is late
    const [error, setError] = useState('');

    const progressAnimation = useState(new Animated.Value(0))[0];

    useEffect(() => {
      if(!level){
        return;
      };

      const questions = level.content.questions;
      const progress = (progressCount / questions.length) * 100;

      Animated.timing(progressAnimation, {toValue: progress, duration: 500, useNativeDriver: false,}).start();
    }, [progressCount, level]);

    const submitAnswer = async (questionId: number, answer: boolean | string | string[] | Record<string, string>) => {
      if(isChecking || !level){
        return;
      }

      setIsChecking(true);

      try{
        const result = await checkAnswer(level.id, questionId, answer);

        setIsCorrect(result.correct);
        setServerFeedback(result.feedback);
        setShowFeedback(true);
        setCollectedAnswers((prev) => [...prev, {question_id: questionId, answer}]);

        if(result.correct){
          setProgressCount((prev) => {
            const missedSoFar = currentIndex - prev;
            const advance = missedSoFar > 0 ? 2 : 1;

            return Math.min(prev + advance, level.content.questions.length);
          });
        }
      }
      catch(error){
        setError('Error validating the answer');
      }
      finally{
        setIsChecking(false);
      }
    };

    const handleContinue = () => {
      if(!showFeedback || !level){
        return;
      }

      const questions = level.content.questions;
      const isLast = currentIndex + 1 >= questions.length;

      if(isLast){ //wait for the animation to get to the end
        setShowFeedback(false);
        Animated.timing(progressAnimation, {toValue: 100, duration: 500, useNativeDriver: false,}).start(() => setFinished(true));
      }

      else{
        setCurrentIndex(prev => prev + 1);
        setShowFeedback(false);
        setIsCorrect(null);
        setServerFeedback("");
      }
    };

    return{currentIndex, showFeedback, isCorrect, serverFeedback, finished, collectedAnswers, progressAnimation, submitAnswer, handleContinue, isChecking};
}