import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

export default function ProfileHeader(){;

    return(
        <View style={styles.header}>
            <Pressable onPress={() => {}}>
                <Feather name="settings" size={24} color={Colors.text}></Feather>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
   header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: Colors.background,
  },
});