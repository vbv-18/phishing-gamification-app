import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import {MaterialIcons} from '@expo/vector-icons'

export default function IconTheory({slide}: {slide: any}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            <View style={styles.iconRow}>
                {slide.media?.map((item: any, index: number) => (
                <View key={index} style={styles.iconItem}>
                    <MaterialIcons name={item.icon || 'info'} size={40} color={Colors.primary}/>
                    <Text style={styles.iconLabel}>{item.label}</Text>
                </View>
            ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
    description: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
  },
  iconItem: {
    alignItems: 'center',
    width: 80,
  },
  iconLabel: {
    marginTop: Spacing.xs,
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});
