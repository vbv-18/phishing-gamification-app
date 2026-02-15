import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

export default function PrimaryButton({ title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 18,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
