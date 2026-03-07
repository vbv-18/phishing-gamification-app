import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

import { getProfile, deleteAccount } from "@/services/api";
import { useAuth } from "context/AuthContext";
import ConfirmPasswordDelete from "./components/ConfirmPasswordDelete";

export default function Profile(){ //future -> use imagePicker from Expo
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const {signOut} = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

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

  return(
    <View style={styles.container}>
      <Pressable>
        <Image source={require('../../assets/images/avatar.png')} style={styles.avatar}></Image>
      </Pressable>

      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.role}>Phishing Rookie</Text>

      <View style={styles.badges}>
        <Text style={styles.badgeTitle}>Badges</Text>
        <View style={styles.badgeGrid}>
          {[...Array(6)].map((_, i) => (<View key={i} style={styles.badge}></View>))}
        </View>
      </View>

      <Pressable onPress={handleSignOut} style={({pressed}) => [styles.signOutButton, styles.button, styles.wrapper, pressed && styles.buttonPressed, styles.buttonWrappedPressed]}>
        {({pressed}) => (
          <View style={[styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </View>
        )}
      </Pressable>

      <Pressable onPress={handleDeleteAccount} style={({pressed}) => [styles.deleteButton, styles.button, styles.wrapper, pressed && styles.buttonPressed, styles.buttonWrappedPressed]}>
        {({pressed}) => (
          <View style={[styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Eliminar cuenta</Text>
          </View>
        )}
      </Pressable>

      <ConfirmPasswordDelete visible={deleteVisible} title="Eliminar cuenta" subtitle="Introduce tu contraseña para confirmar. Esta acción no se puede deshacer"
      confirmLabel="Eliminar" destructive onConfirm={confirmDeleteAccount} onCancel={() => setDeleteVisible(false)}></ConfirmPasswordDelete>

      {error ? <Text style={styles.error}>{error}</Text> : null}

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
    wrapper: {
      borderRadius: 15,
      paddingBottom: 5,
      alignSelf: 'stretch',
    },
    buttonWrapper: {
      backgroundColor: Colors.backgroundPrimary,
      marginBottom: Spacing.sm,
    },
    button: {
      height: 50,
      width: '100%',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    signOutButton: {
      backgroundColor: Colors.primary,
    },
    deleteWrapper:{
      backgroundColor: Colors.shadowSuspicious,
    },
    deleteButton: {
      backgroundColor: Colors.shadowSuspicious,
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
      fontSize: 16,
    },
    error: {
      color: Colors.suspiciousButton,
      marginTop: Spacing.sm,
    },
  });