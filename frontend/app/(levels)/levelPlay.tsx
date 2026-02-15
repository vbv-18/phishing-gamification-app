import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import PrimaryButton from "@/components/PrimaryButton";
import { getLevel } from "@/services/api";
import { useEffect, useState } from "react";

export default function LevelPlay(){
    const {levelId} = useLocalSearchParams();
    const [level, setLevel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

     useEffect(() => {
            async function loadLevel(){
                try{
                    const data = await getLevel(Number(levelId));
                    setLevel(data);
                }
                catch(err: any){
                    setError(err.message || 'Error loading level');
                }
                finally{
                    setLoading(false);
                }
            }
            loadLevel();
        }, []);

    if(loading){ //loader while it is loading
      return(
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if(!level){
        return (
            <View style={styles.center}>
                <Text style={styles.error}>No se pudo cargar el nivel</Text>
            </View>
        );
    }

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Nivel {level.difficulty}: {level.title}</Text>
            <PrimaryButton title="Finalizar (placeholder)" onPress={() => console.log('Ejercicio completado')}/>
        </ScrollView>
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
    fontWeight: '700',
    marginBottom: Spacing.lg,
    color: Colors.text,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: Spacing.sm,
    fontSize: 16,
    textAlign: 'center',
  },
});
