import { View, Text, StyleSheet, Pressable, Animated, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { completeLevel, completeTheory, UserAnswer } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import LevelUp from "../../components/ui/LevelUp";
import ContinueButton from "../../components/ui/ContinueButton";
import { ROLE_BADGE } from "@/constants/Badges";

export default function LevelCompleted(){
    const {levelId, answersJSON, totalQuestions, moduleId, type} = useLocalSearchParams();
    const [xpGained, setXpGained] = useState<number | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState<number | null>(null);
    const [levelUserUp, setLevelUserUp] = useState<{show: boolean, val: number}>({show: false, val: 0});
    const [badgeUp, setBadgeUp] = useState<{show: boolean, val: string, role?: string}>({show: false, val: '', role: undefined});
    const [isContinuePressed, setIsContinuePressed] = useState(false);

    const router = useRouter();
    const scaleAnimation = useRef(new Animated.Value(0.6)).current;
    const opacityAnimation = useRef(new Animated.Value(0)).current;

    const isTheory = type === 'theory';

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnimation, {toValue: 1, useNativeDriver: true, friction: 5,}),
            Animated.timing(opacityAnimation, {toValue: 1, duration: 400, useNativeDriver: true,}),]).start();
    }, []);

    useEffect(() => {
        const markCompleted = async () => {
            try{
                let result;
                if(isTheory){
                    result = await completeTheory(Number(moduleId));
                }
                else{
                    const answers: UserAnswer[] = JSON.parse(Array.isArray(answersJSON) ? answersJSON[0] : answersJSON ?? "[]");
                    result = await completeLevel(Number(levelId), answers);
                    setCorrectAnswers(result.correct_answers);
                }

                setXpGained(result.xp_gained);

                if(result.level_up){
                    setLevelUserUp({show: false, val: result.new_level});
                }

                //badge for new role or for 3 levels completed
                const badgeFromRole = result.role_changed ? ROLE_BADGE[result.new_role] : null;
                const badge = badgeFromRole ?? result.new_badge ?? null;
                if(badge){
                    setBadgeUp({show: false, val: badge, role: badgeFromRole ? result.new_role: undefined});
                }
            }

            catch(e){
                setXpGained(0);
                setCorrectAnswers(0);
            }
        };
        markCompleted();
    }, [levelId, answersJSON, type, moduleId]);

    useEffect(() => {
        if(!isContinuePressed){
            return;
        }

        if(levelUserUp.val > 0 && !levelUserUp.show){
            setLevelUserUp(prev => ({...prev, show: true}));
        }
        else if(levelUserUp.val === 0 && badgeUp.val !== '' && !badgeUp.show){ 
                setBadgeUp(prev => ({...prev, show: true}));
        }
        else if(levelUserUp.val === 0 && badgeUp.val === ''){
             router.replace({pathname: './moduleHome', params: {moduleId}});
        }

    }, [isContinuePressed, levelUserUp.show, badgeUp.show, levelUserUp.val, badgeUp.val]);

    const handleFinish = async() => {
        setIsContinuePressed(true);
    };

    return(
        <View style={styles.container}>
            <Animated.View style={[styles.card, {transform: [{scale: scaleAnimation}], opacity: opacityAnimation,},]}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/pet.png')} style={styles.avatarImage} resizeMode='contain'></Image>
                </View>
                <Text style={styles.title}>{isTheory ? '¡Teoría completada!' : '¡Nivel completado!'}</Text>
                <View style={styles.stats}>
                    {xpGained !== null &&  
                        <View style={styles.correctsContainer}>
                            <Image source={require('../../assets/images/xp.png')} style={styles.correctIcon}></Image>
                            <Text style={styles.score}>{xpGained} XP</Text>
                        </View>
                    }
                    {!isTheory && (
                        correctAnswers !== null ? (
                            <View style={styles.correctsContainer}>
                                <Image source={require('../../assets/images/corrects.png')} style={styles.correctIcon}></Image>
                                <Text style={styles.corrects}>{correctAnswers}/{totalQuestions}</Text>
                            </View>
                        ) : (<ActivityIndicator size="small" color={Colors.primary}></ActivityIndicator>)
                    )}
                </View>
                <ContinueButton onPress={handleFinish} color={Colors.primary} shadow={Colors.backgroundPrimary} textColor="white"></ContinueButton>
            </Animated.View>

            {levelUserUp.show && (<LevelUp type="level" value={levelUserUp.val} onClose={() => {setLevelUserUp({show: false, val: 0})}}></LevelUp>)}
            {badgeUp.show && (<LevelUp type="badge" value={badgeUp.val} role={badgeUp.role} onClose={() => {setBadgeUp({show: false, val: '', role: undefined})}}></LevelUp>)}
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
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
  },
    avatarImage: {
        width: 250,
        height: 250,
  },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: Colors.buttonFeedbackCorrect,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 25,
        marginTop: 10,
    },
    correctsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    correctIcon: {
        width: 80,
        height: 80,
        marginRight: 8,
    },
    corrects: {
        fontSize: 30,
        fontWeight: '900',
        color: Colors.xp,
        marginBottom: 15,
    },
    score: {
        fontSize: 30,
        fontWeight: '900',
        color: Colors.primary,
        marginBottom: 15,
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