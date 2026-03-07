import { View, Text, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import FeedbackText from "../components/FeedbackText";
import ContinueButton from "../components/ContinueButton";
import EmailCard from "../components/EmailCard";
import ZoomInspector from "../components/ZoomInspector";

type Props = { //define interfaces for types
    question: any;
    levelState: any;
};

export default function DomainAnalysis({levelState, question}: Props){ //2 types fo questions: selection and highlight
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [selectedSegments, setSelectedSegments] = useState<number[]>([]); //multiple selection allowed
    const [zoomVisible, setZoomVisible] = useState(false);

    useEffect(() => {
      setSelectedSegments([]);
      setSelectedOption(null);
      setZoomVisible(false);
    }, [question]);

    const handleSelection = (option: any) => {
        if(levelState.showFeedback){
            return;
        }

        setSelectedOption(option);
        const correct = option.is_suspicious === false;
        levelState.submitAnswer(correct);
    };

    const handleSegment = (segment: number) => {
        if(levelState.showFeedback){
            return;
        }
        setSelectedSegments((prev) => prev.includes(segment) ? prev.filter(i => i !== segment) : [...prev, segment]);
    };

    const handleSegmentSubmit = () => {
        if(levelState.showFeedback){
            return;
        }

        const suspiciousSegments = question.url.segments.map((seg: any, index: number) => seg.is_suspicious ? index : null).filter((i: number | null) => i !== null ) as number[]; //return the index of suspicious segments and null if they are not, then remove the nulls
        
        //sort the arrays from minor to major to compare them
        const sortedSelected = [...selectedSegments].sort((a, b) => a - b); 
        const sortedSuspicious = [...suspiciousSegments].sort((a, b) => a - b);
        
        const correct = sortedSelected.length === sortedSuspicious.length && sortedSelected.every((value, index) => value === sortedSuspicious[index]); //compare the number of selected and if them are selected correctly

        levelState.submitAnswer(correct);
    }

    return(
        <View style={styles.container}>
            <Text style={styles.instructions}>{question.instructions}</Text>

            {question.type === "selection" && (<>
            <Text style={styles.brand}>{question.brand}</Text>

                {question.options.map((option: any, index: number) => (
                    <Pressable key={index} disabled={levelState.showFeedback} onPress={() => handleSelection(option)} style={({ pressed }) => [
                        styles.optionWrapper, pressed && !levelState.showFeedback && styles.optionPressed, levelState.showFeedback && styles.disabledWrapper,]}>
                        <View style={styles.option}>
                            <Text style={styles.optionText}>{option.domain}</Text>
                        </View>
                    </Pressable>
                ))}
            </>
            )}

            {question.type === "highlight" && (
                <>
                <EmailCard email={question.email} realUrl={question.url.full} disabled={levelState.showFeedback}></EmailCard>

                <Pressable disabled={levelState.showFeedback} onPress={() => setZoomVisible(true)} style={({pressed}) => [styles.wrapperInspection, pressed && styles.InspectorWrappedPressed]}>
                
                  <View style={styles.inspectButton}>
                    <Text style={styles.inspectText}>🕵️ Inspeccionar</Text>
                  </View>

                </Pressable>

                <ZoomInspector visible={zoomVisible} onClose={() => setZoomVisible(false)} segments={question.url.segments} selectedSegments={selectedSegments}
                  onSelectSegment={handleSegment} onSubmit={() => {handleSegmentSubmit(); setZoomVisible(false);}} showFeedback={levelState.showFeedback}></ZoomInspector>

                {!levelState.showFeedback && (
                    <ContinueButton onPress={handleSegmentSubmit} ></ContinueButton>
                )}
                </>
            )}

            {levelState.showFeedback && (
                <>
                <ContinueButton onPress={levelState.handleContinue} ></ContinueButton>
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
  disabledWrapper: { 
    opacity: 0.5,
  },
});