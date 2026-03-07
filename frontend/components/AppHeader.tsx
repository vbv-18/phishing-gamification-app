import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useUserXp } from "@/hooks/useUserXp";

export default function AppHeader(){
    const {xp} = useUserXp();

    return(
        <View style={styles.header}>
            <View style={styles.xpBadge}>
                <Text style={styles.xpLabel}>XP</Text>
                <Text style={styles.xpText}>{xp !== null ? xp : '...'}</Text>
            </View>
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
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  xpLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.xp,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
    letterSpacing: 1,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});