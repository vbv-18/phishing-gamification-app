import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

export default function CardTheory({slide}: {slide: any}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{slide.title}</Text>
            {slide.items?.map((item: any, index: number) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardText}>{item.text}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    marginBottom: Spacing.xs,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 14,
    color: Colors.text,
  },
});