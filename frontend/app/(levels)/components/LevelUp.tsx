import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

interface Props{
    type: 'level' | 'role';
    value: string | number;
    onClose: () => void;
}

export default function LevelUp({type, value, onClose}: Props){
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {toValue: 1, tension: 50, friction: 7, useNativeDriver: true,}).start();
    }, []);

    return(
        <View style={styles.overlay}>
            <Animated.View style={[styles.container, {transform: [{scale: scaleAnim}]}]}>
                <Text style={styles.emoji}>{type === 'level' ? '⭐' : '🏆'}</Text>
                <Text style={styles.title}>{type === 'level' ? '¡NUEVO NIVEL!' : '¡NUEVO ROL!'}</Text>
                <Text style={styles.value}>{type === 'level' ? `Nivel ${value}` : value}</Text>

                <Pressable onPress={onClose} style={styles.button}>
                    <Text style={styles.buttonText}>¡Genial!</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        width: '80%',
        backgroundColor: Colors.card,
        borderRadius: 30,
        padding: Spacing.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.primary,
        textAlign: 'center',
    },
    value: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.text,
        marginVertical: 15,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 10,
    },
    buttonText: {
        color: Colors.card,
        fontWeight: '700',
        fontSize: 18,
    },
});