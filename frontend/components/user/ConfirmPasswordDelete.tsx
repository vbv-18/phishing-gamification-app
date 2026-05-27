import { Modal, View, Text, TextInput, Pressable, StyleSheet, Keyboard } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Props = {
    visible: boolean;
    title: string,
    subtitle: string;
    confirmLabel: string;
    onConfirm: (password: string) => void;
    onCancel: () => void;
    destructive?: boolean; //optional prop
};

export default function ConfirmPasswordDelete({visible, title, subtitle, confirmLabel, onConfirm, onCancel, destructive = false} : Props){
    const [password, setPassword] = useState('');

    useEffect(() => {
        if(visible){
            setPassword('');
        }
    }, [visible]);

    const handleConfirm = () => {
        if(!password){
            return;
        }

        onConfirm(password);
        setPassword(''); //clean password
    };

    const handleCancel = () => {
        setPassword('');
        onCancel();
    }

    return(
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>

                    <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} autoFocus returnKeyType="done" 
                    onSubmitEditing={handleConfirm}></TextInput>

                    <View style={styles.actions}>
                        <Pressable onPress={handleCancel} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>

                        <Pressable onPress={() => {Keyboard.dismiss(); handleConfirm();}} style={[styles.confirmButton, destructive && styles.confirmButtonDestructive, 
                            !password && {opacity: 0.5}]}>
                            <Text style={styles.confirmText}>{confirmLabel}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    box: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: Spacing.lg,
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.muted,
        marginBottom: Spacing.md,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.muted,
        borderRadius: 10,
        padding: 12,
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        padding: 10,
        justifyContent: 'center',
    },
    cancelText: {
        color: Colors.muted,
        fontWeight: '600',
        fontSize: 15,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    confirmButtonDestructive: {
        backgroundColor: Colors.shadowSuspicious,
    },
    confirmText: {
        color: Colors.card,
        fontWeight: '700',
        fontSize: 15,
    },
});