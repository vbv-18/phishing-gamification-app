import { View, Text, StyleSheet, Pressable, Image, Alert, Animated, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Badges } from "@/constants/Badges";

import { getProfile, deleteAccount } from "@/services/api";
import { useAuth } from "context/AuthContext";
import ConfirmPasswordDelete from "../../components/user/ConfirmPasswordDelete";
import { useUserXp } from "@/hooks/useUserXp";
import ProfileHeader from "../../components/user/ProfileHeader";

export default function Profile(){ //future -> use imagePicker from Expo
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const {signOut} = useAuth();
  const {xp, level, role, xp_for_next_level, is_max_level, unlocked_badges} = useUserXp();
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
        </View>

        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, {width: barWidth}]}></Animated.View>
        </View>

        <Text style={styles.progressLabel}>{is_max_level ? "¡Nivel máximo!" : xp_for_next_level !== null ? `${xp}/${xp_for_next_level} XP siguiente nivel` : ""}</Text>

        <View style={styles.badgesSection}>
          <Text style={styles.badgesTitle}>Insignias</Text>
          <View style={styles.badgeGrid}>
            {Badges.map((badge) => {
              const isUnlocked = unlocked_badges?.includes(badge.id);

              return(
                <View key={badge.id} style={styles.badgeWrapper}>
                  <View style={[styles.badgeCircle, isUnlocked ? {backgroundColor: Colors.card} : styles.badgeCircleLocked]}>
                    {isUnlocked && (
                    <Image source={badge.image} style={styles.badgeImage} resizeMode="contain"/>)}
                  </View>

                  <Text style={styles.badgeName}>{ isUnlocked ? badge.name : ''}</Text>
                </View>
              );
            })}
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
    color: Colors.primary,
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
    borderColor: '#888',
    borderWidth: 1,
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
  badgesSection: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 24,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  badgeWrapper: {
    width: "30%",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  badgeCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeCircleLocked: {
    backgroundColor: Colors.card,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    elevation: 0,
    shadowOpacity: 0,
  },
  badgeImage: {
    width: 44,
    height: 44,
  },
  badgeImageLocked: {
    opacity: 0.2,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
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