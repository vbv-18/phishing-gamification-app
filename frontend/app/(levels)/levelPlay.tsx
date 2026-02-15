import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import PrimaryButton from "@/components/PrimaryButton";

export default function LevelPlay(){
    const params = useLocalSearchParams(); //receive level from theory
    const level = params.level ? JSON.parse(params.level as string) : null;

    if(!level){
        return (
            <View style={styles.center}>
                <Text style={styles.error}>No se pudo cargar el nivel</Text>
            </View>
        );
    }

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Nivel 1: {level.title}</Text>

            <Text style={styles.subtitle}>Email interactivo</Text>

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
    subtitle: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: Spacing.sm,
    fontSize: 16,
    textAlign: 'center',
  },
});
