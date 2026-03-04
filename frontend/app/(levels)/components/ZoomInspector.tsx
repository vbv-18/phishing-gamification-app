import { Modal, View, Text, StyleSheet } from "react-native";
import ContinueButton from "./ContinueButton";
import DomainSegment from "./DomainSegment";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Props = {
    visible: boolean;
    onClose: () => void;
    segments: any[];
    selectedSegments: number[];
    onSelectSegment: (index: number) => void;
    onSubmit: () => void;
    showFeedback: boolean;
};

export default function ZoomInspector({visible, onClose, segments, selectedSegments, onSelectSegment, onSubmit, showFeedback}: Props){
    return(
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Análisis</Text>

                    <View style={styles.container}>
                        {segments.map((segment: any, index: number) => {
                            let value = "";
                            let type = "";
                            let color = "";

                            if (segment.protocol) {
                                value = segment.protocol;
                                type = "Protocolo";
                                color = "#c8e6c9";
                            } else if (segment.subdomain) {
                                value = segment.subdomain;
                                type = "Subdominio";
                                color = "#bbdefb";
                            } else if (segment.domain) {
                                value = segment.domain;
                                type = "Dominio";
                                color = "#ffe0b2";
                            } else if (segment.tld) {
                                value = segment.tld;
                                type = "TLD";
                                color = "#e1bee7";
                            } else if (segment.path) {
                                value = segment.path;
                                type = "Ruta";
                                color = "#ffcdd2";
                            }

                            return(
                                <DomainSegment key={index} value={value} label={type} baseColor={color} selected={selectedSegments.includes(index)} disabled={showFeedback} onPress={() => onSelectSegment(index)}></DomainSegment>
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