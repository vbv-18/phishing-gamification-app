import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import PrimaryButton from '@/components/PrimaryButton';
import { getProfile } from '@/services/api';
import { useEffect, useState } from 'react';
import { removeToken } from '@/services/auth';
import { useRouter } from 'expo-router';

const router = useRouter();

export default function Profile() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  const handleLogout = async () => {
    await removeToken();
    router.replace('/'); // vuelve a Home y limpia historial
  };

  useEffect(() => {
    getProfile().then(setUser).catch(console.error);
  }, []);

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>User: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>

      <PrimaryButton title="Log out" onPress={handleLogout} />
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
  text: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
});
