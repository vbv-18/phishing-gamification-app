import { Modal, View, Text, StyleSheet } from "react-native";
import ContinueButton from "./ContinueButton";
import DomainSegment from "./DomainSegment";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Props = {
    visible: boolean;
    onClose: () => void;
    segments: any[];
    selectedSegments: string[];
    onSelectSegment: (index: string) => void;
    onSubmit: () => void;
    showFeedback: boolean;
};

const SEGMENT_METADATA: Record<string, {label: string, color: string}> = {
  protocol:  { label: "Protocolo",  color: "#c8e6c9" },
  subdomain: { label: "Subdominio", color: "#bbdefb" },
  domain:    { label: "Dominio",    color: "#ffe0b2" },
  tld:       { label: "TLD",        color: "#e1bee7" },
  path:      { label: "Ruta",       color: "#ffcdd2" },
};

function getSegmentKey(segment: any): string {
  return Object.keys(segment).find((k) => k !== "is_suspicious") ?? "";
}

export default function ZoomInspector({visible, onClose, segments, selectedSegments, onSelectSegment, onSubmit, showFeedback}: Props){
    return(
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Análisis</Text>

                    <View style={styles.container}>
                        {segments.map((segment: any, index: number) => {
                            const key = getSegmentKey(segment);
                            const metadata = SEGMENT_METADATA[key];
                            if(!metadata){
                                return null;
                            }

                            return(
                                <DomainSegment key={index} value={segment[key]} label={metadata.label} baseColor={metadata.color} selected={selectedSegments.includes(key)} 
                                disabled={showFeedback} onPress={() => onSelectSegment(key)}></DomainSegment>
                            );
                        })}
                    </View>
                    {!showFeedback && ( <ContinueButton onPress={onSubmit}></ContinueButton>)}

                    <Text style={styles.close} onPress={onClose}>Cerrar</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        backgroundColor: Colors.card,
        padding: Spacing.lg,
        borderRadius: 20,
        width: '90%',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: Spacing.md,
        color: Colors.text,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: Spacing.md,
    },
    close: {
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '600',
        color: Colors.primary,
    },
})