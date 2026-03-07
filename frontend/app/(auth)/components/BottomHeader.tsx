import { View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function BottomHeader(){ //inside of app/(tabs)_layout.tsx automatically in every authenticated screenS
    const router = useRouter();

    return(
        <View style={styles.container}>
            <Pressable onPress={() => router.push('../profile')}>
                <Ionicons name="person-circle-outline" size={32} color={Colors.text}></Ionicons>
            </Pressable>
            <Pressable onPress={() => router.push('../(levels)/home')}>
                <Feather name="home" size={32} color={Colors.text}></Feather>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.shadow,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
    },
});