import { Animated } from "react-native";
import { useEffect, useState } from "react";
import { UserAnswer } from "@/services/api";

function checkCorrect(question: any, answer: boolean | string | string[]): boolean{ //frontend mirrors backend evaluation for immediate feedback
  const expected = question.correct_answer;

  if(typeof expected === "boolean"){
    return answer === expected;
  }

  if(typeof expected === "string"){
    return answer === expected;
  }

  if(Array.isArray(expected)){
    if(!Array.isArray(answer)){
      return false;
    }
    const sortedAnswer = [...answer].map(String).sort();
    const sortedExpected = [...expected].map(String).sort();

    return(sortedAnswer.length === sortedExpected.length && sortedAnswer.every((v,i) => v === sortedExpected[i]));
  }

  return false
}

export function useLevelState(level: any){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [progressCount, setProgressCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [collectedAnswers, setCollectedAnswers] = useState<UserAnswer[]>([]);

    const progressAnimation = useState(new Animated.Value(0))[0];

    useEffect(() => {
      if(!level){
        return;
      }

      const questions = level.content.questions;
      const progress = (progressCount / questions.length) * 100;

      Animated.timing(progressAnimation, {toValue: progress, duration: 500, useNativeDriver: false,}).start();
    }, [progressCount, level]);

    const submitAnswer = (questionId: number, answer: boolean | string | string[]) => {
      const questions = level?.content?.questions ?? [];
      const question = questions.find((q: any) => q.id === questionId);
      const correct = question ? checkCorrect(question, answer) : false;

      setIsCorrect(correct);
      setShowFeedback(true);
      setCollectedAnswers((prev) => [...prev, {question_id: questionId, answer}]);

      if(correct){
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

    return{currentIndex, showFeedback, isCorrect, finished, collectedAnswers, progressAnimation, submitAnswer, handleContinue};
}