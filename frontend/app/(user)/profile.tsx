import { View, Text, StyleSheet, Pressable, Image, Alert, Animated, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

import { getProfile, deleteAccount } from "@/services/api";
import { useAuth } from "context/AuthContext";
import ConfirmPasswordDelete from "../(auth)/components/ConfirmPasswordDelete";
import { useUserXp } from "@/hooks/useUserXp";
import ProfileHeader from "../(auth)/components/ProfileHeader";
import BottomHeader from "@/(auth)/components/BottomHeader";

export default function Profile(){ //future -> use imagePicker from Expo
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const {signOut} = useAuth();
  const {xp, level, role, xp_for_next_level, is_max_level} = useUserXp();
  const progressAnim = useState(new Animated.Value(0))[0]; //for progress XP bar

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if(xp === null){
      return;
    }
    const fraction = is_max_level || xp_for_next_level === null ? 1 : Math.min(xp/xp_for_next_level, 1); //between 0, 1

    Animated.timing(progressAnim, {toValue: fraction, duration: 600, useNativeDriver: false,}).start();
  }, [xp, xp_for_next_level, is_max_level]);

  const loadProfile = async () => {
    try{
      const data = await getProfile();
      setUser(data);
    }

    catch(err: any){
      setError(err.message || 'Error loading profile');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const handleDeleteAccount = () => {
    setDeleteVisible(true);
  };

  const confirmDeleteAccount = async (password: string) => {
    try{
      await deleteAccount(password);
      await signOut();
      setDeleteVisible(false);

      router.replace('/');
    }
    catch(err: any){
      setDeleteVisible(false);
      Alert.alert("Error", err.message);
    }
  };

  if(!user){
    return null;
  }

  const barWidth = progressAnim.interpolate({inputRange: [0, 1], outputRange: ["0%", "100%"],});

  return(
    <View style={{flex: 1}}>
      <ProfileHeader></ProfileHeader>
      <ScrollView style={{flex: 1, backgroundColor: Colors.background}} contentContainerStyle={styles.scrollContent}>
        <Pressable>
          <Image source={require('../../assets/images/avatar.png')} style={styles.avatar}></Image>
        </Pressable>

        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.role}>{role ?? "-"}</Text>

        <View style={styles.xpBadge}>
          <Text style={styles.xpLabel}>Nivel {level ?? "-"}</Text>
          <Text style={styles.xpText}>{xp !== null ? xp : '0'}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, {width: barWidth}]}></Animated.View>
        </View>

        <Text style={styles.progressLabel}>{is_max_level ? "¡Nivel máximo!" : xp_for_next_level !== null ? `${xp}/${xp_for_next_level} XP siguiente nivel` : ""}</Text>

        <View style={styles.badges}>
          <Text style={styles.badgeTitle}>Badges</Text>
          <View style={styles.badgeGrid}>
            {[...Array(6)].map((_, i) => (<View key={i} style={styles.badge}></View>))}
          </View>
        </View>

        <Pressable onPress={handleSignOut} style={({pressed}) => [styles.signOutButton, pressed && styles.signOutPressed]}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </Pressable>

        <Pressable onPress={handleDeleteAccount} style={({pressed}) => [styles.deleteButton, pressed && styles.deletePressed]}>
          <Text style={styles.buttonText}>Eliminar Cuenta</Text>
        </Pressable>

        <ConfirmPasswordDelete visible={deleteVisible} title="Eliminar cuenta" subtitle="Introduce tu contraseña para confirmar. Esta acción no se puede deshacer"
        confirmLabel="Eliminar" destructive onConfirm={confirmDeleteAccount} onCancel={() => setDeleteVisible(false)}></ConfirmPasswordDelete>

        {error ? <Text style={styles.error}>{error}</Text> : null}

      </ScrollView>
      <BottomHeader></BottomHeader>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  scrollContent: {
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: Spacing.sm,
  },
  username: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  role: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: Spacing.lg,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 6,
  },
  xpLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.xp,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
    letterSpacing: 1,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  progressContainer:{
    width: '85%',
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  badges: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.muted,
    marginBottom: Spacing.sm,
  },
  signOutButton: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.backgroundPrimary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  signOutPressed: {
    transform: [{ translateY: 5 }],
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  deleteButton: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 15,
    backgroundColor: Colors.suspiciousButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadowSuspicious,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  deletePressed: {
    transform: [{ translateY: 5 }],
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  buttonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  error: {
    color: Colors.suspiciousButton,
    marginTop: Spacing.sm,
  },
});