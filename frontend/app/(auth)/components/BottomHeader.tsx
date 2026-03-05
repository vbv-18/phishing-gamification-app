import { View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Ionicons } from "@expo/vector-icons";

export default function BottomHeader(){ //inside of app/(tabs)_layout.tsx automatically in every authenticated screenS
    const router = useRouter();

    return(
        <View style={styles.container}>
            <Pressable style={styles.profileContainer} onPress={() => router.push('../profile')}>
                <Ionicons name="person-circle-outline" size={32} color={Colors.text}></Ionicons>
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
        justifyContent: 'flex-end',
        paddingHorizontal: Spacing.lg,
    },
    profileContainer: {
        padding: 6,
    },
});