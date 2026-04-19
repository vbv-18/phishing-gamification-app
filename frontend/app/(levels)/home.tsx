import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useRouter } from 'expo-router';
import AppHeader from "@/components/ui/AppHeader";
import { useEffect, useState } from "react";
import { getModules } from "@/services/api";

export default function Home(){
    const router = useRouter();
    const [modules, setModules] = useState<{id: number, name: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      const loadModules = async () => {
      try{
            const data = await getModules();
              setModules(data);
          }
          catch(err: any){
            setError(err.message || 'Error loading modules');
          }
          finally{
            setLoading(false);
          }
      };
      loadModules();
    }, []);

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
              <Text style={styles.title}>Selecciona un módulo</Text>

              {modules.map((m) => (
                  <View key={m.id} style={styles.moduleCard}>
                      <View style={styles.cardTop}>
                          <Text style={styles.levelText}>{m.name.charAt(0).toUpperCase() + m.name.slice(1)}</Text>
                      </View>

                      <Pressable style={({pressed}) => [
                          styles.startButton, pressed && styles.startPressed,]}

                          onPress={() => router.push({pathname: "./moduleHome", params: {moduleName: m.name},})}>
                          <Text style={styles.startText}>START</Text>
                      </Pressable>

                  </View>
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
    fontSize: 25,
    fontWeight: '800',
    marginBottom: Spacing.lg,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  moduleCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
},

modulePressed: {
  transform: [{ translateY: 4 }],
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
},

cardTop: {
  marginBottom: 20,
},

levelText: {
  fontSize: 22,
  fontWeight: "800",
  color: Colors.card,
},

startButton: {
  backgroundColor: Colors.card,
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
},

startText: {
  fontWeight: "700",
  color: Colors.startButton,
  letterSpacing: 1,
},
startPressed: {
  transform: [{ translateY: 2 }],
  elevation: 2,
},

});