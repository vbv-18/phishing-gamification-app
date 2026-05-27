import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useEffect } from "react";
import { useLoadLevel } from "@/hooks/useLoadLevel";
import { useLevelState } from "@/hooks/useLevelState";
import { useAuth } from "context/AuthContext";
import LevelHeader from "../../components/ui/LevelHeader";
import { TYPES } from "renders/mechanicsMap";

export default function LevelPlay(){
    const {levelId, moduleId} = useLocalSearchParams();
    const router = useRouter();
    const {isAuthenticated} = useAuth();
    const {level, loading, error} = useLoadLevel(levelId as string);
    const levelState = useLevelState(level);

    useEffect(() => {
      if(levelState.finished && level){
        const questions = level.content.questions;
        router.replace({pathname: './levelCompleted', params: {levelId, answersJSON: JSON.stringify(levelState.collectedAnswers), totalQuestions: questions.length, moduleId},});
      }
    }, [levelState.finished]);

    useEffect(() => { //defensa en profundidad?
      if(!isAuthenticated){
        router.replace("/");
      }
    }, [isAuthenticated]);

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

    const questions = level.content.questions;
    const currentQuestion = questions[levelState.currentIndex];
    const Renderer = TYPES[level.content.mechanic];
    return(
        <View style={styles.container}>
            <LevelHeader progressAnimation={levelState.progressAnimation} onClose={() => router.back()}></LevelHeader>

            {Renderer ? (
              <Renderer key={currentQuestion.id} question={currentQuestion} levelState={levelState} instructions={level.content.instructions}></Renderer>
            ) : <Text  style={styles.error}>Ejercicio no desarrollado</Text>
          }
        </View>
    );
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
error: {
    color: 'red',
    marginBottom: Spacing.sm,
    fontSize: 16,
    textAlign: 'center',
  },
});
