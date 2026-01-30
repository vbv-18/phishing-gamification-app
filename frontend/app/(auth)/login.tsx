import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import PrimaryButton from '@/components/PrimaryButton';
import { loginUser } from '@/services/api';
import { saveToken } from '@/services/auth';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
  try {
    const data = await loginUser({ username, password });

    await saveToken(data.access_token);

    router.replace('/profile');
  } catch (err: any) {
    setError(err.message || 'Error log in');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Type your credentials</Text>

      <TextInput
        placeholder="User"
        value={username}
        onChangeText={setUsername}
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

      <PrimaryButton title="Log in" onPress={handleLogin} />
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
});
