import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

export default function Home() {
  const router = useRouter();

  const handleSignIn = async () => {
    router.push('./signIn');
  }

  const handleSignUp = async () => {
    router.push('./signUp');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PhishAware 🐟</Text>
      <Text style={styles.subtitle}>Aprende sobre phishing jugando!</Text>

      <Pressable onPress={handleSignIn} style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonWrappedPressed]}>{({ pressed }) => (
          <View style={[styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </View>
        )}
      </Pressable>

      <Pressable onPress={handleSignUp} style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonWrappedPressed]}>{({ pressed }) => (
          <View style={[styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </View>
        )}
      </Pressable>

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
  buttonWrapper: {
    backgroundColor: Colors.backgroundPrimary, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    width: 300,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    transform: [{translateY: 0}],
  },
  buttonWrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],

  },
  buttonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16
  },
});
