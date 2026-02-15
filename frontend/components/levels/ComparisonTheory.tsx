import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

export default function ComparisonTheory({slide}: {slide: any}){
    const left = slide.media?.left?.label ? [slide.media.left.label] : [];
    const right = slide.media?.right?.label ? [slide.media.right.label] : [];

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>{slide.leftTitle || 'Seguro'}</Text>
                    {left.map((item: any, index: number) => (
                        <Text key={index} style={styles.itemText}>• {item}</Text>
                    ))}
                </View>

                <View style={styles.column}>
                    <Text style={styles.columnTitle}>{slide.rightTitle || 'Sospechoso'}</Text>
                    {right?.map((item: any, index: number) => (
                        <Text key={index} style={styles.itemText}>• {item}</Text>
                    ))}
                </View>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    marginBottom: Spacing.xs,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  itemText: {
    marginBottom: 4,
    fontSize: 14,
    color: Colors.text,
  },
});