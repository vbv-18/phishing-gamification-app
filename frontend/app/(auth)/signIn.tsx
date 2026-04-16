import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { loginUser } from '@/services/api';
import { useState } from 'react';
import { useAuth } from 'context/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {signIn} = useAuth();

  const handleSignIn = async () => {
  try {
    const data = await loginUser({ username, password });

    await signIn(data.access_token, data.refresh_token); //update state

    router.replace('/home');
  } catch (err: any) {
    setError(err.message || 'Error sign in');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenida/o!</Text>
      <Text style={styles.subtitle}>Introduce tus credenciales</Text>

      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
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

      <Pressable onPress={handleSignIn} style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonWrappedPressed]}>{({ pressed }) => (
        <View style={[styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
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
    height: 50,
    width: 364,
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
