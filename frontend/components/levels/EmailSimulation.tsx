import { View, Text, StyleSheet, Pressable, Modal, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { PhishingSimulationQuestion } from "@/types/exercise";
import { ExerciseRenderProps } from "@/types/renderer";
import ContinueButton from "../ui/ContinueButton";

export default function EmailSimulation({levelState, instructions, question}: ExerciseRenderProps){
    const q = question as PhishingSimulationQuestion

    const handleAnswer = (optionId: boolean) =>{
        if(levelState.showFeedback){
        return;
    }
    
    levelState.submitAnswer(question.id, optionId);
    }

    return(
      <View style={styles.container}>
          <Text style={styles.instructions}>{instructions}</Text>
          <View style={styles.emailWrapper}>
              <View style={styles.emailHeader}>
                  <View style={styles.avatar}>
                    <MaterialIcons name="person" size={22} color={Colors.text}></MaterialIcons>
                  </View>
                  <View style={styles.headerTextContainer}>
                      <Text style={styles.from} ellipsizeMode="tail">{q.email.from}</Text>
                  </View>
              </View>
            <View style={styles.bodyContainer}>
                <Text style={styles.subject}>{q.email.subject}</Text>
                <Text style={styles.body}>{q.email.body}</Text>
              </View>
          </View>

            <Pressable onPress={() => handleAnswer(false)} disabled={levelState.showFeedback} style={({ pressed }) => [styles.suspiciousWrapper, pressed &&
            !levelState.showFeedback && styles.suspiciousWrappedPressed, levelState.showFeedback && styles.disabledWrapper]}>
                {({ pressed }) => (
                <View style={[styles.suspicious, pressed && !levelState.showFeedback && styles.suspiciousPressed, levelState.showFeedback && styles.disabledInner]}>
                    <Text style={styles.suspiciousText}>Sospechoso</Text>
                </View>
                )}
            </Pressable>

            <Pressable onPress={() => handleAnswer(true)} disabled={levelState.showFeedback} style={({ pressed }) => [styles.legitimateWrapper, pressed &&
            !levelState.showFeedback && styles.legitimateWrappedPressed, levelState.showFeedback && styles.disabledWrapper]}>
                {({ pressed }) => (
                <View style={[styles.legitimate, pressed && !levelState.showFeedback && styles.legitimatePressed, levelState.showFeedback && styles.disabledInner]}>
                    <Text style={styles.legitimateText}>Legítimo</Text>
                </View>
                )}
            </Pressable>

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

        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    flex: 1,
  },
  instructions: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
emailWrapper:{
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: Colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  from: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.backgroundPrimary,
  },
  subject: {
    fontWeight: '700',
    fontSize: 16,
  },
  bodyContainer: {
    marginTop: 8,
    paddingTop: 5,
    borderTopColor: '#EEE',
  },
  body: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
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
  }
});