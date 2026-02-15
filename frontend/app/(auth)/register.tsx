import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import PrimaryButton from '@/components/PrimaryButton';
import { registerUser } from '@/services/api';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser({ username, email, password });
      router.push('./login');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>

      <TextInput
        placeholder="User"
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton title="Sign in" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'center',
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
});
