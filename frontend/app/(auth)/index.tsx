import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PhishAware 🐟</Text>
      <Text style={styles.subtitle}>Learn to detect phishing while playing</Text>

      <Link href="./login" style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </Link>
      <Link href="./register" style={[styles.button, { marginTop: Spacing.md }]}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 18,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
