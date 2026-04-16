import { View, Text, StyleSheet, Pressable, Dimensions, Image, Modal } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import ContinueButton from "../components/ContinueButton";

interface Option{ //options typed
    id: string;
    text: string;
}
interface Question{
    id: number;
    situation: string;
    options: Option[];
}

type Props = { //define interfaces for types
    instructions: string;
    question: Question;
    levelState: any;
};

const {height} = Dimensions.get("window");

const formatText = (text: string) => { //to format the email in the situation text
  const parts = text.split(/('.*?')/g);

  return parts.map((part, index) => {
    if(part.startsWith("'") && part.endsWith("'")){
      return (
        <Text key={index} style={styles.emailHighlight}>{part}</Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

export default function ContextDecision({levelState, instructions, question}: Props){
    const handleAnswer = (optionId: string) =>{
        if(levelState.showFeedback){
        return;
    }
    levelState.submitAnswer(question.id, optionId);
    }

    return(
            <View style={styles.container}>
                <Text style={styles.instructions}>{instructions}</Text>
                <View style={styles.avatarContainer}>
                  <Image source={require('../../../assets/images/hacker.png')} style={styles.avatarImage} resizeMode='contain'></Image>
                  <View style={styles.situationContainer}>
                    <View style={styles.situationArrow}></View>
                    <Text style={styles.situationText}>{formatText(question.situation)}</Text>
                  </View>
                </View>                    
    
                {question.options.map((option) => (
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
                        <Text style={[styles.resultTitle, levelState.isCorrect ? styles.correctText : styles.incorrectText]}>{levelState.isCorrect ? '¡No es phishing!' : 'Phishing'}</Text>
                        <Image source={levelState.isCorrect ? require('../../../assets/images/winner.png') : require('../../../assets/images/robber.png')} style={styles.avatarImage}></Image>
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
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  avatarImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  situationContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.borderColor,
    padding: 12,
    marginLeft: 15,
    position: 'relative',
  },
  situationArrow: {
    position: 'absolute',
    left: -10,
    top: 15,
    bottom: 20,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: Colors.borderColor,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
  situationText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: '800',
    fontStyle: 'italic',
    color: Colors.text,
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
