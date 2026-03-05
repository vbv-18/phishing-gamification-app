import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useRouter } from 'expo-router';
import BottomHeader
 from "@/(auth)/components/BottomHeader";
export default function Home(){
    const router = useRouter();
    const modules = [
        {id: 1, title: "email"},
    ];

    return(
        <View style={{flex:1}}>
          <ScrollView style={styles.container}>
              <Text style={styles.title}>Bienvenido</Text>
              <Text style={styles.subtitle}>Selecciona un módulo</Text>

              {modules.map((m) => (
                  <View key={m.id} style={styles.moduleCard}>
                      <View style={styles.cardTop}>
                          <Text style={styles.levelText}>Módulo 1 - Emails</Text>
                      </View>

                      <Pressable style={({pressed}) => [
                          styles.startButton, pressed && styles.startPressed,]}

                          onPress={() => router.push({pathname: "./moduleHome", params: {moduleName: m.title},})}>
                          <Text style={styles.startText}>START</Text>
                      </Pressable>

                  </View>
              ))}
          </ScrollView>
          <BottomHeader></BottomHeader>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
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

  // efecto 3D
  shadowColor: Colors.shadow,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 0,

  elevation: 8, // Android
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