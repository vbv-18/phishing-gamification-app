import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Props = { //the parameters that the component use (properties)
    show: boolean;
    isCorrect: boolean | null;
    correctText: string;
    wrongText: string;
};

export default function FeedbackText({show, isCorrect, correctText, wrongText,}: Props){
    if(!show){
        return null;
    }

    return(
        <Text style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,]}>{isCorrect ? correctText : wrongText}</Text>
    );
}

const styles = StyleSheet.create({
    feedback: {
    marginTop: Spacing.md,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 'bold', 
    color: Colors.primary,
  },
  feedbackCorrect: {
    color: Colors.shadowLegitimate,
  },
  feedbackWrong: {
    color: Colors.shadowSuspicious,
  },
})