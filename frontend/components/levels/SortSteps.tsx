import { View, Text, StyleSheet, Modal, Image, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import ContinueButton from "../ui/ContinueButton";
import { ExerciseRenderProps } from "types/renderer";
import { StepsQuestion } from "@/types/exercise";

export default function SortSteps({levelState, instructions, question}: ExerciseRenderProps){
    const q = question as StepsQuestion;
    const [available, setAvailable] = useState(q.display_order.map(id => q.steps.find(s => s.id === id)!));
    const [sequence, setSequence] = useState<typeof q.steps>([]);

    const handleOrderAdd = (stepId: string) => {
        if(levelState.showFeedback){
            return;
        }
        const step = available.find(s => s.id === stepId)!;
        setAvailable(prev => prev.filter(s => s.id !== stepId));
        setSequence(prev => [...prev, step]);
    };

    const handleOrderRemove = (stepId: string) => {
        if(levelState.showFeedback){
            return;
        }
        const step = sequence.find(s => s.id === stepId)!;
        setSequence(prev => prev.filter(s => s.id !== stepId));
        setAvailable(prev => [...prev, step]);
    };
      
    const handleAnswer = () => {
        if(levelState.showFeedback){
            return;
        }
        levelState.submitAnswer(question.id, sequence.map(s => s.id));
    }

    
    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <Text style={styles.instructions}>{instructions}</Text>
            <Text style={styles.context}>{q.context}</Text>

            <View>
                {sequence.map((step, index) => (
                  <Pressable key={step.id} onPress={() => handleOrderRemove(step.id)} disabled={levelState.showFeedback} style={({pressed}) => 
                  [styles.stepCard, styles.stepCardPlaced, pressed && !levelState.showFeedback && styles.stepCardPressed]}>
                      <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step.text}</Text>
                  </Pressable>))
                }
            </View>

            <View style={styles.availableSection}>
                {available.map((step, index) => (
                  <Pressable key={step.id} onPress={() => handleOrderAdd(step.id)} disabled={levelState.showFeedback} style={({pressed}) => 
                  [styles.stepCard, pressed && !levelState.showFeedback && styles.stepCardPressed]}>
                      <Text style={styles.stepText}>{step.text}</Text>
                  </Pressable>))}
            </View>

            <View style={styles.checkWrapper}>
                <Pressable onPress={handleAnswer} disabled={levelState.showFeedback} style={({pressed}) => [styles.checkButtonWrapper, 
                    (levelState.showFeedback) && styles.disabledWrapper, pressed  && !levelState.showFeedback &&styles.checkButtonWrapperPressed,]}>
                            {({pressed}) => (
                                <View style={[styles.checkButton, (levelState.showFeedback) && styles.disabledInner, pressed  && !levelState.showFeedback &&
                                styles.checkButtonPressed,]}>
                                    <Text style={styles.checkButtonText}>Comprobar</Text>
                                </View>
                            )}
                    </Pressable>
            </View>

            <Modal visible={levelState.showFeedback} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.feedbackScreen, levelState.isCorrect ? styles.correctBg : styles.incorrectBg]}>
                        <View style={styles.feedbackContent}>
                            <Text style={[styles.resultTitle, levelState.isCorrect ? styles.correctText : styles.incorrectText]}>{levelState.isCorrect ? '¡Bien visto!' : '¡Casi!'}</Text>
                            <Image source={levelState.isCorrect ? require('../../assets/images/winner.png') : require('../../assets/images/robber.png')} style={styles.avatarImage}></Image>
                            <Text style={[styles.feedbackText, levelState.isCorrect ? styles.correctText : styles.incorrectText]}>{levelState.serverFeedback}</Text>
                        </View>
                        <View style={styles.footer}>
                            <ContinueButton onPress={levelState.handleContinue} color={levelState.isCorrect ? Colors.legitimateButton : Colors.suspiciousButton}
                            shadow={levelState.isCorrect ? Colors.buttonFeedbackCorrect : Colors.buttonFeedbackWrong} textColor="white"></ContinueButton>
                        </View>
                    </View>
                </View>
                </Modal>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  instructions: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
  context: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    opacity: 0.85,
  },
  availableSection: {
    minHeight: 60,
    gap: 8,
    marginBottom: Spacing.md,
  },
  placeholder: {
    color: Colors.text,
    opacity: 0.35,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
  },
  stepCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  stepCardPlaced: {
    backgroundColor: Colors.background,
    borderLeftWidth: 3,
    borderLeftColor: Colors.legitimateButton,
  },
  stepCardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.legitimateButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: Colors.text,
  },
  checkWrapper: {
    marginTop: Spacing.sm,
  },
  checkButtonWrapper: {
    backgroundColor: Colors.shadowLegitimate,
    borderRadius: 15,
    paddingBottom: 5,
    alignSelf: 'stretch',
  },
  checkButtonWrapperPressed: {
    paddingBottom: 0,
    transform: [{ translateY: 5 }],
  },
  checkButton: {
    backgroundColor: Colors.legitimateButton,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonPressed: {
    transform: [{translateY: 0}],
  },
  checkButtonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  disabledInner: {
    backgroundColor: '#c4c4c4'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  avatarImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  feedbackScreen: {
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  correctBg: {
    backgroundColor: Colors.backgroundFeedbackCorrect,
  },
  incorrectBg: {
    backgroundColor: Colors.backgroundFeedbackWrong,
  },
  correctText: {
    color: Colors.shadowLegitimate,
  },
  incorrectText: {
    color: Colors.shadowSuspicious,
  },
  feedbackContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  feedbackCard: {
    backgroundColor: Colors.shadowContinue,
    padding: 15,
    borderRadius: 15,
    width: '100%',
  },
  feedbackText: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.text,
  },
  footer: {
    width: '100%',
    marginTop: 5,
  }
})