import { View, Text, StyleSheet, Pressable, Animated, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { completeLevel, UserAnswer } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import LevelUp from "./components/LevelUp";

export default function LevelCompleted(){
    const {levelId, answersJSON, totalQuestions, moduleName} = useLocalSearchParams();
    const [xpGained, setXpGained] = useState<number | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState<number | null>(null);
    const [levelUserUp, setLevelUserUp] = useState<{show: boolean, val: number}>({show: false, val: 0});
    const [roleUp, setRoleUp] = useState<{show: boolean, val: string}>({show: false, val: ''});
    const [isContinuePressed, setIsContinuePressed] = useState(false);

    const router = useRouter();
    const scaleAnimation = useRef(new Animated.Value(0.6)).current;
    const opacityAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnimation, {toValue: 1, useNativeDriver: true, friction: 5,}),
            Animated.timing(opacityAnimation, {toValue: 1, duration: 400, useNativeDriver: true,}),]).start();
    }, []);

    useEffect(() => {
        const markCompleted = async () => {
            try{
                const answers: UserAnswer[] = JSON.parse(Array.isArray(answersJSON) ? answersJSON[0] : answersJSON ?? "[]");
                const result = await completeLevel(Number(levelId), answers);

                setXpGained(result.xp_gained);
                setCorrectAnswers(result.correct_answers);

                //if there have been new level/role
                if(result.role_changed){
                    setRoleUp({show: false, val: result.new_role});
                }
                if(result.level_up){
                    setLevelUserUp({show: false, val: result.new_level});
                }
            }

            catch(e){
                setXpGained(0);
                setCorrectAnswers(0);
            }
        };
        markCompleted();
    }, [levelId, answersJSON]);

    useEffect(() => {
        if(!isContinuePressed){
            return;
        }

        if(!levelUserUp.show && !roleUp.show){
            if(levelUserUp.val > 0){
                setLevelUserUp(prev => ({...prev, show: true}));
            }
            else if(roleUp.val !== ''){
                setRoleUp(prev => ({...prev, show: true}));
            }
            else{
                router.replace({pathname: './moduleHome', params: {moduleName}});
            }
        }
    }, [isContinuePressed, levelUserUp.show, roleUp.show]);

    const handleFinish = async() => {
        setIsContinuePressed(true);
    };

    return(
        <View style={styles.container}>
            <Animated.View style={[styles.card, {transform: [{scale: scaleAnimation}], opacity: opacityAnimation,},]}>
                <Text style={styles.icon}>🛡️</Text>
                <Text style={styles.title}>¡Nivel completado!</Text>
                {xpGained !== null && <Text style={styles.score}>XP ganado: {xpGained}</Text>}
                {correctAnswers !== null ? (<Text>Has acertado {correctAnswers}/{totalQuestions}</Text>) : (<ActivityIndicator size="small" color={Colors.primary}></ActivityIndicator>)}
                <Text style={styles.subtitle}>¡Buen trabajo!</Text>

                <Pressable onPress={handleFinish} style={({ pressed }) => [styles.continueWrapper, pressed && styles.continueWrappedPressed]}>
                    <View style={styles.continue}>
                        <Text style={styles.continueText}>Continuar</Text>
                    </View>
                </Pressable>
            </Animated.View>

            {levelUserUp.show && (<LevelUp type="level" value={levelUserUp.val} onClose={() => {setLevelUserUp({show: false, val: 0})}}></LevelUp>)}
            {roleUp.show && (<LevelUp type="role" value={roleUp.val} onClose={() => {setRoleUp({show: false, val: ''})}}></LevelUp>)}
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