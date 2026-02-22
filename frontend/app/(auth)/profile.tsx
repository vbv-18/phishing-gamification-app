import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { getProfile } from '@/services/api';
import { useEffect, useState } from 'react';
import { removeToken } from '@/services/auth';
import { useRouter } from 'expo-router';

const router = useRouter();

export default function Profile() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  const handleSignOut = async () => {
    await removeToken();
    router.replace('/'); // vuelve a Home y limpia historial
  };

  useEffect(() => {
    getProfile().then(setUser).catch(console.error);
  }, []);

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.text}>Usuario: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>

      <Pressable onPress={handleSignOut} style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonWrappedPressed]}>{({ pressed }) => (
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
  text: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.sm,
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
