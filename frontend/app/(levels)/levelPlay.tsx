import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import PrimaryButton from "@/components/PrimaryButton";
import { getLevel, completeLevel } from "@/services/api";
import { useEffect, useState } from "react";

export default function LevelPlay(){
    const {levelId, moduleName} = useLocalSearchParams();
    const [level, setLevel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAsnwer] = useState<boolean | null >(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const progressAnimation = useState(new Animated.Value(0))[0];

    useEffect(() => {
      if(!level) return;
      
        const questions = level.content.questions;
        const progress = (currentIndex / questions.length) * 100;

        Animated.timing(progressAnimation, {toValue: progress, duration: 500, useNativeDriver: false,}).start();
      }, [currentIndex, level]);

    useEffect(() => {
      async function loadLevel(){
        try{
          const data = await getLevel(Number(levelId));
            setLevel(data);
        }
        catch(err: any){
            setError(err.message || 'Error loading level');
        }
        finally{
          setLoading(false);
        }
      }
      loadLevel();
    }, []);

    useEffect(() => {
      if(finished && level){
        const questions = level.content.questions;
        router.push({pathname: './levelCompleted', params: {levelId, score, maxScore: questions.length * level.points, moduleName},});
      }
    }, [finished]);

    if(loading){ //loader while it is loading
      return(
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if(!level){
        return (
            <View style={styles.center}>
                <Text style={styles.error}>No se pudo cargar el nivel</Text>
            </View>
        );
    }
    
    if(level.content.exercise_type === "signal_classification"){
      return renderSignalClassification();
    }

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Nivel {level.difficulty}: {level.title}</Text>
            <PrimaryButton title="Tipo de ejercicio no desarrollado" onPress={() => {}}/>
        </ScrollView>
    );

    function renderSignalClassification(){
      const questions = level.content.questions;
      const currentQuestion = questions[currentIndex];

      const handleAnswer = (answer: boolean) =>{
        if(selectedAnswer !== null){
          return;
        }

        setSelectedAsnwer(answer);
        setShowFeedback(true);

        const correct = answer === currentQuestion.is_suspicious;
        setIsCorrect(correct);

        if(correct){
          setScore((prev) => prev + level.points);
        }
      };

      const handleContinue = () => {
        if(selectedAnswer == null){
          return;
        }

        if(currentIndex + 1 < questions.length){
          setCurrentIndex(prev => prev + 1);
          setSelectedAsnwer(null);
          setShowFeedback(false);
        }
        else{
          setFinished(true);
        }
      };

      return(
        <View style={styles.container}>

          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Text style={styles.closeIcon}>X</Text>
            </Pressable>

            <View style={styles.progressBar}>
               <Animated.View style={[styles.progressBarFill, {width: progressAnimation.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%'],}),},]}></Animated.View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.context}>{currentQuestion.context}</Text>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          <Pressable onPress={() => handleAnswer(true)} disabled={showFeedback} style={({ pressed }) => [styles.suspiciousWrapper, pressed && !showFeedback &&
            styles.suspiciousWrappedPressed, showFeedback && styles.disabledWrapper]}>
            {({ pressed }) => (
            <View style={[styles.suspicious, pressed && !showFeedback && styles.suspiciousPressed, showFeedback && styles.disabledInner]}>
              <Text style={styles.suspiciousText}>Sospechoso</Text>
            </View>
          )}
          </Pressable>

          <Pressable onPress={() => handleAnswer(false)} disabled={showFeedback} style={({ pressed }) => [styles.legitimateWrapper, pressed && !showFeedback &&
            styles.legitimateWrappedPressed,showFeedback && styles.disabledWrapper]}>
            {({ pressed }) => (
            <View style={[styles.legitimate, pressed && !showFeedback && styles.legitimatePressed, showFeedback && styles.disabledInner]}>
              <Text style={styles.legitimateText}>Legítimo</Text>
            </View>
          )}
          </Pressable>

          {showFeedback && (
            <>              
              <Pressable onPress={handleContinue} style={({pressed}) => [styles.continueWrapper, pressed && styles.continueWrappedPressed]}>

                <View style={styles.continue}>
                  <Text style={styles.continueText}>Continuar</Text>
                </View>

              </Pressable>

              <Text style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>{isCorrect ? currentQuestion.feedback_correct : currentQuestion.feedback_wrong}</Text>

            </>
          )}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: Spacing.lg,
    color: Colors.text,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: Spacing.sm,
    fontSize: 16,
    textAlign: 'center',
  },
  progress: {
    textAlign: "center",
    marginBottom: Spacing.md,
    fontSize: 16,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    elevation: 3,
  },
  context: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  feedback: {
    marginTop: Spacing.md,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 'bold', 
    color: Colors.primary,
  },
  feedbackCorrect: {
    color: Colors.shadowLegitimate,
    fontWeight: "bold",
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  feedbackWrong: {
    color: Colors.shadowSuspicious,
    fontWeight: "bold",
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    marginBottom: Spacing.lg,
    color: Colors.text,
  },
  suspiciousWrapper: {
    backgroundColor: Colors.shadowSuspicious, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
  },
  suspicious: {
    backgroundColor: Colors.suspiciousButton,
    height: 50,
    width: 364,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suspiciousPressed: {
    transform: [{translateY: 0}],
  },
  suspiciousWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  suspiciousText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16
  },
  legitimateWrapper: {
    backgroundColor: Colors.shadowLegitimate, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
  },
  legitimate: {
    backgroundColor: Colors.legitimateButton,
    height: 50,
    width: 364,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legitimatePressed: {
    transform: [{translateY: 0}],
  },
  legitimateWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  legitimateText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16
  },
  continueWrapper: {
    backgroundColor: Colors.shadowContinue, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
  },
  continue: {
    backgroundColor: Colors.continueButton,
    height: 50,
    width: 364,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continuePressed: {
    transform: [{translateY: 0}],
  },
  continueWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  continueText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  disabledInner:{
    backgroundColor: '#c4c4c4'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  closeIcon:{
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  progressBar:{
    width: '80%',
    height: 15,
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 60,
    marginHorizontal: 40,
    marginBottom: 10,
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#eccd1b',
    borderRadius: 20,
  }
});
