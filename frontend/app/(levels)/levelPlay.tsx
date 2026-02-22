import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryButton1 from "@/components/PrimaryButton1";
import { getLevel, completeLevel } from "@/services/api";
import { useEffect, useState } from "react";

export default function LevelPlay(){
    const {levelId} = useLocalSearchParams();
    const [level, setLevel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAsnwer] = useState<boolean | null >(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

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

        if(answer === currentQuestion.is_suspicious){
          setScore((prev) => prev + level.content.points);
        }
      };

      const handleContinue = () => {
        if(currentIndex + 1 < questions.length){
          setCurrentIndex(prev => prev + 1);
          setSelectedAsnwer(null);
          setShowFeedback(false);
        }
        else{
          setFinished(true);
        }
      };

      if(finished){
        return(
          <View style={styles.center}>
            <Text style={styles.title}>Nivel completado</Text>
            <Text style={styles.score}>Puntuación: {score} / {questions.length * level.content.points}</Text>
            <PrimaryButton title="Finalizar" onPress={async () => {await completeLevel(level.id); router.back()}}></PrimaryButton>
          </View>
        );
      }

      return(
        <View style={styles.container}>
          <Text style={styles.progress}>Pregunta {currentIndex + 1} de {questions.length}</Text>

          <View style={styles.card}>
            <Text style={styles.context}>{currentQuestion.context}</Text>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          <Pressable onPress={() => handleAnswer(true)} style={({ pressed }) => [styles.suspiciousWrapper, pressed && styles.suspiciousWrappedPressed]}>{({ pressed }) => (
            <View style={[styles.suspicious, pressed && styles.suspiciousPressed]}>
              <Text style={styles.suspiciousText}>Sospechoso</Text>
            </View>
          )}
          </Pressable>

          <Pressable onPress={() => handleAnswer(false)} style={({ pressed }) => [styles.legitimateWrapper, pressed && styles.legitimateWrappedPressed]}>{({ pressed }) => (
            <View style={[styles.legitimate, pressed && styles.legitimatePressed]}>
              <Text style={styles.suspiciousText}>Legítimo</Text>
            </View>
          )}
          </Pressable>

          <Pressable onPress={handleContinue} style={({ pressed }) => [styles.continueWrapper, pressed && styles.continueWrappedPressed]}>{({ pressed }) => (
            <View style={[styles.continue, pressed && styles.continuePressed]}>
              <Text style={styles.continueText}>Continuar</Text>
            </View>
          )}
          </Pressable>

          {showFeedback && (<Text style={styles.feedback}>{level.feedback[currentQuestion.reason_key]}</Text>)}

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
    color: Colors.primary,
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
});
