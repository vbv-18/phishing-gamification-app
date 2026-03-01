import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useEffect } from "react";
import { useLoadLevel } from "@/hooks/useLoadLevel";
import { useLevelState } from "@/hooks/useLevelState";
import LevelHeader from "./components/LevelHeader";
import SignalClassification from "./exercises/level1";

export default function LevelPlay(){
    const {levelId, moduleName} = useLocalSearchParams();
    const router = useRouter();

    const {level, loading, error} = useLoadLevel(levelId);
    const levelState = useLevelState(level);

    useEffect(() => {
      if(levelState.finished && level){
        const questions = level.content.questions;
        router.push({pathname: './levelCompleted', params: {levelId, score: levelState.score, maxScore: questions.length * level.points, moduleName},});
      }
    }, [levelState.finished, levelState.score]);


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

    return(
        <View style={styles.container}>
            <LevelHeader progressAnimation={levelState.progressAnimation} onClose={() => router.back()}></LevelHeader>

            {level.content.exercise_type === "signal_classification"
                ? <SignalClassification question={currentQuestion} levelState={levelState}></SignalClassification>
                : <Text style={styles.error}>Ejercicio no desarrollado</Text>
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
