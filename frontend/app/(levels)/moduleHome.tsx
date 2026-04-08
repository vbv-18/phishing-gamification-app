import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { getLevelsbyModule } from "@/services/api";
import BottomHeader from "@/components/BottomHeader";
import AppHeader from "@/components/AppHeader";

export default function ModuleHome(){
    const {moduleName} = useLocalSearchParams();
    const router = useRouter();
    const [levels, setLevels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

   const loadLevels = async () => {
    try{
      const data = await getLevelsbyModule(moduleName as string);
        setLevels(data);
    }
    catch(err: any){
      setError(err.message || 'Error loading levels');
    }
    finally{
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadLevels();
    }, [moduleName])
  );

  if(loading){ //loader while it is loading
      return(
          <View style={styles.center}>
              <ActivityIndicator size="large" color={Colors.primary} />
          </View>
      );
  }

  return(
    <View style={{flex:1}}>
      <AppHeader></AppHeader>
      <ScrollView style={styles.container}>
          <Text style={styles.title}>Niveles</Text>

          {levels.map((level) => (
              <Pressable key={level.id} style={[styles.levelCard, !level.unlocked && styles.levelLocked,]} disabled={!level.unlocked} onPress={() => router.push({pathname: './levelPlay', params: {levelId: level.id, moduleName},})}>
                  <Text style={styles.levelTitle}>Nivel {level.difficulty}: {level.title}</Text>
                  <Text style={styles.status}>{level.completed ? "Completado" : level.unlocked ? "Disponible" : "Bloqueado"}</Text>
              </Pressable>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: Spacing.lg,
    color: Colors.text,
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  levelLocked: {
    opacity: 0.4,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.card,
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.card,
  },
  error: {
    color: 'red',
    marginBottom: Spacing.sm,
    fontSize: 16,
    textAlign: 'center',
  },

});