import { View, Text, StyleSheet, Pressable, Modal, Image } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import ContinueButton from "../ui/ContinueButton";
import UrlCard from "./UrlCard";
import ZoomInspector from "./ZoomInspector";
import { ExerciseRenderProps } from "types/renderer";
import { DomainAnalysisQuestion } from "@/types/exercise";

export default function DomainAnalysis({levelState, instructions, question}: ExerciseRenderProps){
    const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
    const [zoomVisible, setZoomVisible] = useState(false);
    const q = question as DomainAnalysisQuestion

    useEffect(() => {
      setSelectedSegments([]);
      setZoomVisible(false);
    }, [question]);

    const handleSegment = (type: string) => {
        if(levelState.showFeedback){
            return;
        }
        setSelectedSegments((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
    };

    const handleSegmentSubmit = () => {
        if(levelState.showFeedback){
            return;
        }
        levelState.submitAnswer(question.id, selectedSegments);
        setZoomVisible(false);
    }

    return(
        <View style={styles.container}>
            <Text style={styles.instructions}>{instructions}</Text>

                <UrlCard key={q.id} urlData={q.url} disabled={levelState.showFeedback} onInspect={() => setZoomVisible(true)}></UrlCard>

                <ZoomInspector visible={zoomVisible} onClose={() => setZoomVisible(false)} segments={q.url.segments} selectedSegments={selectedSegments}
                  onSelectSegment={handleSegment} onSubmit={() => {handleSegmentSubmit(); setZoomVisible(false);}} showFeedback={levelState.showFeedback}></ZoomInspector>

                {!levelState.showFeedback && (
                    <ContinueButton onPress={handleSegmentSubmit} ></ContinueButton>
                )}

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
  },
  instructions: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: Spacing.lg,
    color: Colors.primary,
  },
  optionWrapper:{
    backgroundColor: Colors.shadowContinue,
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
  },
  option: {
    backgroundColor: Colors.card,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  wrapperInspection: {
    backgroundColor: Colors.backgroundPrimary, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  InspectorPressed: {
    transform: [{translateY: 0}],
  },
  InspectorWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  inspectButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: 'center',
  },
  inspectText: {
    fontWeight: "700",
    color: Colors.card,
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
  },
  avatarImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
});