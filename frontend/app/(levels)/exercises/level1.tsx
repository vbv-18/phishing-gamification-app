import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import FeedbackText from "../components/FeedbackText";
import ContinueButton from "../components/ContinueButton";

type Props = { //define interfaces for types
    question: any;
    levelState: any;
};

export default function SignalClassification({levelState, question}: Props){
  const handleAnswer = (answer: boolean) =>{
    if(levelState.showFeedback){
      return;
    }
    const correct = answer === question.is_suspicious;
    levelState.submitAnswer(correct);
    };
    
    return(
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.context}>{question.context}</Text>
                <Text style={styles.questionText}>{question.text}</Text>
            </View>

            <Pressable onPress={() => handleAnswer(true)} disabled={levelState.showFeedback} style={({ pressed }) => [styles.suspiciousWrapper, pressed &&
            !levelState.showFeedback && styles.suspiciousWrappedPressed, levelState.showFeedback && styles.disabledWrapper]}>
                {({ pressed }) => (
                <View style={[styles.suspicious, pressed && !levelState.showFeedback && styles.suspiciousPressed, levelState.showFeedback && styles.disabledInner]}>
                    <Text style={styles.suspiciousText}>Sospechoso</Text>
                </View>
                )}
            </Pressable>

            <Pressable onPress={() => handleAnswer(false)} disabled={levelState.showFeedback} style={({ pressed }) => [styles.legitimateWrapper, pressed &&
            !levelState.showFeedback && styles.legitimateWrappedPressed, levelState.showFeedback && styles.disabledWrapper]}>
                {({ pressed }) => (
                <View style={[styles.legitimate, pressed && !levelState.showFeedback && styles.legitimatePressed, levelState.showFeedback && styles.disabledInner]}>
                    <Text style={styles.legitimateText}>Legítimo</Text>
                </View>
                )}
            </Pressable>

            {levelState.showFeedback && (
                <>
                  <ContinueButton onPress={levelState.handleContinue}></ContinueButton>
                  <FeedbackText show={true} isCorrect={levelState.isCorrect} correctText={question.feedback_correct} wrongText={question.feedback_wrong}></FeedbackText>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  context: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  suspiciousWrapper: {
    backgroundColor: Colors.shadowSuspicious, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  suspicious: {
    backgroundColor: Colors.suspiciousButton,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suspiciousPressed: {
    transform: [{translateY: 0}],
  },
  suspiciousWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  suspiciousText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16
  },
  legitimateWrapper: {
    backgroundColor: Colors.shadowLegitimate, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  legitimate: {
    backgroundColor: Colors.legitimateButton,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legitimatePressed: {
    transform: [{translateY: 0}],
  },
  legitimateWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  legitimateText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  disabledInner:{
    backgroundColor: '#c4c4c4'
  },
})
