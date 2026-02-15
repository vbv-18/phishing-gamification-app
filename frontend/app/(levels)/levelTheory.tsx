import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import PrimaryButton from "@/components/PrimaryButton";
import { getNextLevel, getLevel } from "@/services/api";
import RenderTheory from "@/components/levels/RenderTheory"
import { useLocalSearchParams } from "expo-router";

export default function LevelTheory(){
    const router = useRouter();
    const [level, setLevel] = useState<any>(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const {levelId} = useLocalSearchParams<{levelId: string}>();
    const levelIdParsed = Number(levelId);

    useEffect(() => {
        async function load(){
            try{
                const data = levelIdParsed ? await getLevel(Number(levelIdParsed)) : await getNextLevel(); //load level from backend
                setLevel(data);
            
            }catch(err: any){
                setError(err.message || 'Error loading level');
            
            }finally{
                setLoading(false);
            }
        }
        load();
    }, []);

    if(loading){ //loader while it is loading
        return(
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if(error || !level){
        return(
            <View style={styles.center}>
                <Text style={styles.error}>{error || 'Error loading level'}</Text>
            </View>
        );
    }

    const slide = level.theory[currentSlide];

    const handleNext = () => {
        if(currentSlide < level.theory.length - 1){
            setCurrentSlide(currentSlide + 1);
        }
        else{
            router.push({pathname: './levelPlay', params: {level: JSON.stringify(level)}});
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{level.title}</Text>

            <RenderTheory slide={slide} />

            <View style={{marginTop: Spacing.xl}}>
                <PrimaryButton title={currentSlide < level.theory.length -1 ? "Siguiente" : "Comenzar Nivel"} onPress={handleNext} />
            </View>

            <Text style={styles.progress}>{currentSlide + 1} / {level.theory.length}</Text>
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
  progress: {
    marginTop: Spacing.md,
    color: Colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
});
