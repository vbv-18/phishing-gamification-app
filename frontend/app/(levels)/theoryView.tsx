import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useLoadTheory } from "@/hooks/useLoadTheory";
import { completeTheory } from "@/services/api";
import { TheoryCard, useTheoryCardAnimation } from "@/components/levels/TheoryCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TheoryView(){
    const {moduleId} = useLocalSearchParams();
    const {theoryData, loading, error} = useLoadTheory(moduleId as string);
    const [completing, setCompleting] = useState(false);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [itemIndex, setItemIndex] = useState(0);
    const router = useRouter();
    const {opacity, translateX, animateTransition} = useTheoryCardAnimation();
    const insets = useSafeAreaInsets();
    const {height: screenHeight} = useWindowDimensions();

    useEffect(() => {
        setSectionIndex(0);
        setItemIndex(0);
    }, [moduleId]);

    const handleComplete = async() => {
        if(completing){
            return;
        }

        setCompleting(true);
        try{
            await completeTheory(Number(moduleId));
            router.back();
        }

        catch{
            setCompleting(false);
        }
    };

    if(loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if(error || !theoryData){
        return (
            <View style={styles.center}>
                <Text style={styles.error}>No se pudo cargar la teoría</Text>
            </View>
        );
    }

    const sections = theoryData.theory;
    const section = sections[sectionIndex];
    const currentItem = section?.items?.[itemIndex];
    const isLastItem = itemIndex === (section?.items?.length ?? 1) - 1;
    const isLastSection = sectionIndex === sections.length -1;

    const handleNext = () => {
        if(!isLastItem){
            animateTransition(() => {setItemIndex((prev) => prev + 1);});
        }

        else if(!isLastSection){
            animateTransition(() => {setSectionIndex((prev) => prev + 1);
            setItemIndex(0);
            });
        }
    };

    return (
        <View style={[styles.container, {paddingTop: insets.top + Spacing.md}]}>

            <View style={styles.dotsContainer}>
                {sections.map((_, idx) => (<View key={idx} style={[styles.dot, idx === sectionIndex && styles.dotActive]}></View>))}
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDesc}>{section.description}</Text>

                {currentItem && (<TheoryCard key={`${sectionIndex} - ${itemIndex}`} item={currentItem} opacity={opacity} translateX={translateX} screenHeight={screenHeight}></TheoryCard>)}
            </ScrollView>

            <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, Spacing.lg)}]}>
                {!isLastItem || !isLastSection ? (
                    <Pressable style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>{isLastItem ? 'Siguiente Sección' : 'Siguiente'}</Text>
                    </Pressable>
                ) : (
                    <Pressable style={[styles.button, completing && styles.buttonDisabled]} onPress={handleComplete} disabled={completing}>
                        <Text style={styles.buttonText}>{completing ? 'Guardando...' : 'Teoría completada'}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
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
    content: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    sectionDesc: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        opacity: 0.7,
        marginBottom: Spacing.lg,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.card,
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.muted,
    },
    dotActive: {
        backgroundColor: Colors.moduleCompleted,
        width: 24,
    },
})
