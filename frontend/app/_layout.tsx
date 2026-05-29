import { Stack } from 'expo-router';
import { AuthProvider } from 'context/AuthContext';
import { LevelAnswersProvider } from 'context/LevelAnswersContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LevelAnswersProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LevelAnswersProvider>
    </AuthProvider>
  );
}
