import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { registerUser } from '@/services/api';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await registerUser({ username, email, password });
      router.push('./signIn');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear una cuenta</Text>

      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

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
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: Spacing.md,
    color: Colors.text,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.muted,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  error: {
    color: 'red',
    marginBottom: Spacing.sm,
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
    width: 364,
    height: 50,
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
