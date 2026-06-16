import { View, Text, StyleSheet, Modal, Image, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import ContinueButton from "@/components/ui/ContinueButton";
import { ExerciseRenderProps } from "@/types/renderer";
import { FileChoiceQuestion } from "@/types/exercise";
import { AntDesign } from "@expo/vector-icons";

export default function FileChoice({levelState, instructions, question}: ExerciseRenderProps){
  const q = question as FileChoiceQuestion;

  const getFileIcon = (type: string) => {
      switch(type){
          case 'pdf': return {name: 'file-pdf', color: Colors.suspiciousButton};
          case 'word': return {name: 'file-word', color: '#2B579A'};
          case 'png': return {name: 'file-image', color: '#3498DB'};
          case 'folder': return {name: 'folder-open', color: '#F1C40F'};
          default: return {name: 'file', color: '#95A5A6'};
      }
  };

  const icon = getFileIcon(q.icon_type)

  const handleAnswer = (optionId: string) =>{
      if(levelState.showFeedback){
      return;
    }
    
    levelState.submitAnswer(question.id, optionId);
  }

  return(
    <View style={styles.container}>
      <Text style={styles.instructions}>{instructions}</Text>

      <View style={styles.fileViewer}>
        <View style={styles.iconImage}>
          <AntDesign name={icon.name as any} size={80} color={icon.color}></AntDesign>
        </View>

        <Text style={styles.fileName}>{q.file_name}</Text>
        <Text style={styles.fileSize}>Tamaño: 2.4 MB</Text>
      </View>
        
      {q.options.map((option) => (
        <Pressable key={option.id} onPress={() => handleAnswer(option.id)} disabled={levelState.showFeedback} style={({ pressed }) => [styles.optionWrapper, pressed &&
        !levelState.showFeedback && styles.optionWrappedPressed, levelState.showFeedback && styles.disabledWrapper,]}
        >
          {({pressed}) => (
          <View style={[styles.optionInner, pressed && !levelState.showFeedback && styles.optionInnerPressed, levelState.showFeedback && styles.disabledInner,]}>
            <Text style={styles.optionText}>{option.text}</Text>
          </View>
          )}
        </Pressable>
      ))}
        
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
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  instructions: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  avatarImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  fileViewer: {
    backgroundColor: Colors.card,
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    marginBottom: 40,
    shadowColor: Colors.text,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fileName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  optionWrapper: {
    backgroundColor: Colors.backgroundPrimary, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  optionInner: {
    backgroundColor: Colors.primary,
    minHeight: 60,
    paddingHorizontal: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInnerPressed: {
    transform: [{translateY: 0}],
  },
  optionWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  optionText: {
    color: Colors.card,
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  feedbackContainer: {
    marginTop: 20,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  disabledInner:{
    backgroundColor: Colors.disabledButton,
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