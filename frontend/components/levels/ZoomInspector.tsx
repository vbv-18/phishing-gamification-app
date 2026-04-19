import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import ContinueButton from "../ui/ContinueButton";
import DomainSegment from "./DomainSegment";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Props = {
    visible: boolean;
    onClose: () => void;
    segments: {type: string, value: string}[];
    selectedSegments: string[];
    onSelectSegment: (type: string) => void;
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

export default function ZoomInspector({visible, onClose, segments, selectedSegments, onSelectSegment, onSubmit, showFeedback}: Props){
    return(
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Analizador de URLs</Text>
                    <Text style={styles.subtitle}>Selecciona las partes sospechosas (si hay)</Text>

                    <View style={styles.container}>
                        {segments.map((segment, index) => {
                            const metadata = SEGMENT_METADATA[segment.type];

                            return(
                                <DomainSegment key={index} value={segment.value} label={metadata?.label || 'Link'} baseColor={metadata?.color || '#F5F5F5'} selected={selectedSegments.includes(segment.type)} 
                                disabled={showFeedback} onPress={() => onSelectSegment(segment.type)}></DomainSegment>
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
    subtitle: {
        fontSize: 14,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
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