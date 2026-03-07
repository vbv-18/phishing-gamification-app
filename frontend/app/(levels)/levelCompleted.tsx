import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { completeLevel } from "@/services/api";
import { useEffect, useRef } from "react";

export default function LevelCompleted(){
    const {levelId, score, maxScore, moduleName} = useLocalSearchParams();
    const router = useRouter();

    const scaleAnimation = useRef(new Animated.Value(0.6)).current;
    const opacityAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnimation, {toValue: 1, useNativeDriver: true, friction: 5,}),
            Animated.timing(opacityAnimation, {toValue: 1, duration: 400, useNativeDriver: true,}),]).start();
    }, []);

    const handleFinish = async() => {
        try{
            await completeLevel(Number(levelId));
            router.replace({pathname: './moduleHome', params: {moduleName}});
        }
        catch(e){
            //already managed
        }
    };

    return(
        <View style={styles.container}>
            <Animated.View style={[styles.card, {transform: [{scale: scaleAnimation}], opacity: opacityAnimation,},]}>
                <Text style={styles.icon}>🛡️</Text>
                <Text style={styles.title}>¡Nivel completado!</Text>
                <Text style={styles.score}>Puntuación: {score} / {maxScore}</Text>
                <Text style={styles.subtitle}>¡Buen trabajo!</Text>

                <Pressable onPress={handleFinish} style={({ pressed }) => [styles.continueWrapper, pressed && styles.continueWrappedPressed]}>
                    <View style={styles.continue}>
                        <Text style={styles.continueText}>Continuar</Text>
                    </View>
                </Pressable>
            </Animated.View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    card:{
        width: '90%',
        backgroundColor: Colors.card,
        borderRadius: 20,
        padding: Spacing.xl,
        alignItems: 'center',
        elevation: 5,
    },
    icon: {
        fontSize: 70,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    score: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '600',
        color: Colors.primary,
        marginTop: Spacing.sm,
    },
    repeatText: {
        marginTop: Spacing.md,
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
continueWrapper: {
    backgroundColor: Colors.shadowContinue, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  continue: {
    backgroundColor: Colors.continueButton,
    height: 50,
    width: '100%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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