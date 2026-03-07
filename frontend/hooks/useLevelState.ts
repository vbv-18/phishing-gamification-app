import { Animated } from "react-native";
import { useEffect, useState } from "react";

export function useLevelState(level: any){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [progressCount, setProgressCount] = useState(0);
    const [finished, setFinished] = useState(false);

    const progressAnimation = useState(new Animated.Value(0))[0];

    useEffect(() => {
      if(!level) return;
      
      const questions = level.content.questions;
      const progress = (progressCount / questions.length) * 100;

      Animated.timing(progressAnimation, {toValue: progress, duration: 500, useNativeDriver: false,}).start();
    }, [progressCount, level]);

    const submitAnswer = (answer: boolean) =>{
      setIsCorrect(answer);
      setShowFeedback(true);

      if(answer){
        setCorrectAnswers((prev) => prev + 1);
        setProgressCount((prev) => {
          if(!level){
            return prev;
          }
          //the progress bar increases for correct answer, not increases if mistake
          const questions = level.content.questions;
          const missedSoFar = currentIndex - prev;
          const advance = missedSoFar > 0 ? 2 : 1; //progress 1 for actual correct, recover 1 mistake
          return Math.min(prev + advance, questions.length);
        });
      }
    };

    const handleContinue = () => {
      if(!showFeedback){
        return;
      }

      const questions = level.content.questions;
      const isLast = currentIndex + 1 >= questions.length;

      if(isLast){ //wait for the animation to get to the end
        Animated.timing(progressAnimation, {toValue: 100, duration: 500, useNativeDriver: false,}).start(() => setFinished(true));
      }

      else{
        setCurrentIndex(prev => prev + 1);
        setShowFeedback(false);
        setIsCorrect(null);
      }
    };

    return{currentIndex, showFeedback, isCorrect, correctAnswers, finished, progressAnimation, submitAnswer, handleContinue};
}