import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import {Hexagon} from "lucide-react-native"
import { useUserXp } from "@/hooks/useUserXp";

interface Props{
    type: 'level' | 'role';
    value: string | number;
    onClose: () => void;
}

export default function LevelUp({type, value, onClose}: Props){
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const {xp, xp_for_next_level, is_max_level, level} = useUserXp();

    useEffect(() => {
        Animated.spring(scaleAnim, {toValue: 1, tension: 50, friction: 7, useNativeDriver: true,}).start();

        if(type === 'level'){
            if(xp === null){
                return;
            }
            const fraction = is_max_level || xp_for_next_level === null ? 1 : Math.min(xp/xp_for_next_level, 1);
            Animated.timing(progressAnim, {toValue: fraction, duration: 1000, delay: 500, useNativeDriver: false,}).start();
        }
    }, [xp, xp_for_next_level, is_max_level]);

    const barWidth = progressAnim.interpolate({inputRange: [0, 1], outputRange: ["0%", "100%"],});

    return(
            <Animated.View style={[styles.container, {transform: [{scale: scaleAnim}]}]}>
                <View style={type === 'level' ? styles.hexagonWrapper : styles.roleImageWrapper}>
                    {type === 'level' ? (
                        <>
                        <Hexagon size={160} color={Colors.primary} fill={Colors.primary} strokeLinejoin="miter" strokeWidth={1}></Hexagon>
                        <Text style={styles.hexagonNumber}>{value}</Text>
                        </>
                    ) : (<Image source={require('../../assets/images/roleUp.png')} style={styles.roleImage} resizeMode="contain"></Image>)}
                </View>

                <Text style={styles.title}>{type === 'level' ? '¡NUEVO NIVEL!' : '¡NUEVO ROL!'}</Text>
                {type === 'role' && (<Text style={styles.roleUp}>{value}</Text>)}

                {type === 'level' && (
                    <View style={styles.progressSection}>
                        <View style={styles.rowBar}>
                            <View style={styles.endCircle}>
                                <Text style={styles.circleText}>XP</Text>
                            </View>

                            <View style={styles.progressContainer}>
                                <Animated.View style={[styles.progressBar, { width: barWidth }]} />
                            </View>

                            <View style={styles.endCircle}>
                                <Text style={styles.circleText}>{is_max_level ? value : (Number(value) || 0) + 1}</Text>
                            </View>
                        </View>

                    <Text style={styles.progressLabel}>
                        {is_max_level ? "¡Nivel máximo!" : `${xp} / ${xp_for_next_level}`}
                    </Text>
                    </View>
                )}

                <Pressable onPress={onClose} style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}>
                    <Text style={styles.buttonText}>¡Genial!</Text>
                </Pressable>
            </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.backgroundLevelUp,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
        zIndex: 1000,
    },
    roleImageWrapper: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    roleImage: {
        width: '90%',
        height: '90%',
    },
    roleUp: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.background,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 20,
    },
    hexagonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    hexagonNumber: {
      position: 'absolute',
      fontSize: 48,
      fontWeight: '900',
      color: Colors.card,
    },
    progressSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 35,
    },
    progressContainer: {
        flex: 1,
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: -5,
        zIndex: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
    },
    progressLabel: {
        fontSize: 14,
        color: Colors.card,
        marginTop: 5,
        fontWeight: '600',
    },
    rowBar: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        justifyContent: 'center',
    },
    endCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    circleText: {
        color: Colors.card,
        fontSize: 12,
        fontWeight: '900',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.background,
        textAlign: 'center',
        marginBottom: 10,
    },
    value: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.text,
        marginVertical: 15,
    },
    button: {
        backgroundColor: Colors.card,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.startButton,
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: 1,
    },
    buttonPressed: {
      transform: [{translateY: 2}],
      elevation: 2,
    },  
});