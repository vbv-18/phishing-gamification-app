import { useRef } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { TheoryItem } from "@/types/module";
import { getCardVisuals } from "@/constants/theoryVisuals";

interface TheoryCardProps{
    item: TheoryItem;
    opacity: Animated.Value;
    translateX: Animated.Value;
    screenHeight: number;
}

export function TheoryCard({item, opacity, translateX, screenHeight}: TheoryCardProps) {
    const visuals = getCardVisuals(item.concept);
    const dynamixMinHeight = Math.max(screenHeight * 0.35, 220);

    return (
        <Animated.View style={[styles.card, {opacity, transform: [{ translateX }], minHeight: dynamixMinHeight}]}>
            <View style={[styles.iconContainer, { backgroundColor: visuals.bg }]}>
                <MaterialCommunityIcons 
                    name={visuals.icon as any} 
                    size={36} 
                    color={visuals.color} 
                />
            </View>

            <Text style={[styles.concept, { color: visuals.color }]}>
                {item.concept}
            </Text>
            
            <View style={styles.divider} />

            <Text style={styles.definition}>{item.definition}</Text>
        </Animated.View>
    );
}

export function useTheoryCardAnimation(){
    const opacity = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;

    const animateTransition = (next: () => void) => {
        Animated.parallel( [Animated.timing(opacity, {toValue: 0, duration: 200, useNativeDriver: true}),
            Animated.timing(translateX, {toValue: -40, duration: 200, useNativeDriver: true}),]).start(() => {
                next();
                translateX.setValue(40);
                Animated.parallel([Animated.timing(opacity, {toValue: 1, duration: 200, useNativeDriver: true}),
                    Animated.timing(translateX, {toValue: 0, duration: 200, useNativeDriver: true}),]).start();
        });
    };

    return {opacity, translateX, animateTransition};
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: Spacing.lg,
        width: '100%',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        marginVertical: 14,
        minHeight: 240,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    concept: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: Spacing.xs,
        textAlign: 'center',
        letterSpacing: 0.35,
    },
    divider: {
        width: 32,
        height: 3,
        backgroundColor: Colors.card,
        borderRadius: 2,
        marginBottom: Spacing.md,
    },
    definition: {
        fontSize: 15,
        color: Colors.text,
        textAlign: 'center',
        lineHeight: 23,
        paddingHorizontal: Spacing.xs,
    },
});