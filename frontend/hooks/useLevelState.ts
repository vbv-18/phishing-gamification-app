import { Animated } from "react-native";
import { useEffect, useState } from "react";

export function useLevelState(level: any){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [finished, setFinished] = useState(false);

    const progressAnimation = useState(new Animated.Value(0))[0];

    useEffect(() => {
      if(!level) return;
      
        const questions = level.content.questions;
        const progress = (currentIndex / questions.length) * 100;

        Animated.timing(progressAnimation, {toValue: progress, duration: 500, useNativeDriver: false,}).start();
    }, [currentIndex, level]);

    const submitAnswer = (answer: boolean) =>{
      setIsCorrect(answer);
      setShowFeedback(true);

      if(answer){
        setCorrectAnswers((prev) => prev + 1);
      }
    };

    const handleContinue = () => {
        if(!showFeedback){
          return;
        }

        const questions = level.content.questions;

        if(currentIndex + 1 < questions.length){
          setCurrentIndex(prev => prev + 1);
          setShowFeedback(false);
          setIsCorrect(null);
        }
        else{
          setFinished(true);
        }
    };

    return{currentIndex, showFeedback, isCorrect, correctAnswers, finished, progressAnimation, submitAnswer, handleContinue};
}