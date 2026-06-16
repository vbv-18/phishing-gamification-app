import { View, Text, StyleSheet, Modal, Image, ScrollView, Pressable  } from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import ContinueButton from "@/components/ui/ContinueButton";
import { ExerciseRenderProps } from "@/types/renderer";
import { MatchQuestion } from "@/types/exercise";

export default function Match({levelState, instructions, question}: ExerciseRenderProps){
    const q = question as MatchQuestion;
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selections, setSelections] = useState<Record<string, string>>({}); //{"left": "right"}

    const handleSelectLeft = (leftId: string) => {
        if(levelState.showFeedback){
            return;
        }
        setSelectedLeft(prev => prev === leftId ? null : leftId);
    };

    const handleSelections = (rightId: string) => {
        if(levelState.showFeedback || !selectedLeft){
            return;
        }
        setSelections(prev => ({...prev, [selectedLeft]: rightId}));
        setSelectedLeft(null);
    };

    const handleRemove = (leftId: string) => {
        if(levelState.showFeedback){
            return;
        }
        setSelections(prev => {const next = {...prev}; delete next[leftId]; return next;});
    };

    const handleAnswer = () => {
        if(levelState.showFeedback){
            return;
        }
        levelState.submitAnswer(question.id, selections);
    };

    const unassigned = q.left.filter(item => !selections[item.id]);

    return(
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <Text style={styles.instructions}>{instructions}</Text>

            <View style={styles.unassignedSection}>
                {unassigned.map(item => (
                    <Pressable key={item.id} onPress={() => handleSelectLeft(item.id)} disabled={levelState.showFeedback}
                        style={({ pressed }) => [styles.itemCard, selectedLeft === item.id && styles.itemCardSelected,
                            pressed && !levelState.showFeedback && styles.itemCardPressed]}>
                        <Text style={styles.itemText}>{item.text}</Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.entitiesColumn}>
                {q.right.map(rightItem => (
                    <Pressable key={rightItem.id} onPress={() => handleSelections(rightItem.id)} disabled={levelState.showFeedback || !selectedLeft}
                        style={({ pressed }) => [styles.entityCard, pressed && !!selectedLeft && !levelState.showFeedback && styles.itemCardPressed]}>
                        <Text style={styles.entityTitle}>{rightItem.text}</Text>
                        {q.left.filter(item => selections[item.id] === rightItem.id).map(item => (
                            <Pressable key={item.id} onPress={() => handleRemove(item.id)} disabled={levelState.showFeedback}
                                style={styles.assignedCard}>
                                <Text style={styles.itemText}>{item.text}</Text>
                            </Pressable>
                        ))}
                    </Pressable>
                ))}
            </View>


            <View style={styles.checkWrapper}>
                <Pressable onPress={handleAnswer} disabled={levelState.showFeedback} style={({ pressed }) => [styles.checkButtonWrapper, levelState.showFeedback &&
                styles.disabledWrapper, pressed && !levelState.showFeedback && styles.checkButtonWrapperPressed,]}>
                    {({ pressed }) => (
                        <View style={[styles.checkButton, levelState.showFeedback && styles.disabledInner, pressed && !levelState.showFeedback && styles.checkButtonPressed,]}>
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
  unassignedSection: {
    gap: 8,
    marginBottom: Spacing.md,
  },
  entitiesColumn: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: Spacing.md,
  },
  entityCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.sm,
    minHeight: 100,
    gap: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 6,
  },
  entityCardActive: {
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  entityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.card,
    textAlign: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  assignedCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: 10,
    shadowColor: Colors.text,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 6,
    gap: 10,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 19,
    color: Colors.text,
  },
  itemCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  itemCardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionWrapper: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 10,
    paddingBottom: 4,
  },
  optionWrapperSelected: {
    backgroundColor: Colors.primary,
  },
  optionWrapperPressed: {
    paddingBottom: 0,
    transform: [{ translateY: 4 }],
  },
  optionInner: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  optionInnerSelected: {
    backgroundColor: Colors.primary,
  },
   optionInnerPressed: {
    transform: [{ translateY: 0 }],
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.backgroundPrimary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.card,
  },
  checkWrapper: {
    marginTop: Spacing.sm,
  },
  checkButtonWrapper: {
    backgroundColor: Colors.shadowContinue,
    borderRadius: 15,
    paddingBottom: 5,
    alignSelf: 'stretch',
  },
  checkButtonWrapperPressed: {
    paddingBottom: 0,
    transform: [{ translateY: 5 }],
  },
  checkButton: {
    backgroundColor: Colors.continueButton,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonPressed: {
    transform: [{ translateY: 0 }],
  },
  checkButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  disabledInner: {
    backgroundColor: '#c4c4c4',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
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
  },
  avatarImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
})
