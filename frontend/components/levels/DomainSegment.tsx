import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
    value: string;
    label: string;
    baseColor: string;
    selected: boolean;
    disabled: boolean;
    onPress: () => void;
};

export default function DomainSegment({value, label, baseColor, selected, disabled, onPress,}: Props){
    return(
        <Pressable disabled={disabled} onPress={onPress} style={[styles.wrapper, {backgroundColor: baseColor}, selected && styles.selected,]}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        margin: 6,
        minWidth: 90,
    },
    selected: {
        borderWidth: 2,
        borderColor: Colors.shadowSuspicious,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    label: {
        fontSize: 11,
        marginTop: 4,
        color: Colors.text,
        opacity: 0.7,
    },
});