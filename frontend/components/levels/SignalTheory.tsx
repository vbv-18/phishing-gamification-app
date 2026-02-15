import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

export default function SignalTheory({slide}: {slide: any}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{slide.title}</Text>

            <Text style={styles.explanation}>{slide.explanation}</Text>

            <View style={styles.exampleBox}>
                <Text style={styles.exampleSubject}>Asunto: {slide.example?.subject}</Text>
                <Text style={styles.exampleBody}>{slide.example?.body}</Text>
            </View>

            <Text style={styles.remember}>{slide.remember}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.card,
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    title:{
        fontSize: 20,
        fontWeight: '700',
        marginBottom: Spacing.sm,
        color: Colors.text,
    },
    explanation:{
        fontSize: 16,
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    exampleBox:{
        backgroundColor: Colors.background,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.muted,
        marginBottom: Spacing.md,
    },
    exampleSubject:{
        fontWeight: '600',
        marginBottom: 4,
        color: Colors.text,
    },
    exampleBody: {
        color: Colors.muted,
    },
    remember:{
        fontStyle: 'italic',
        color: Colors.primary,
    },
});