import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { PhishingSimulationQuestion } from "@/types/exercise";
import { ExerciseRenderProps } from "@/types/renderer";

type Props = ExerciseRenderProps & {
  disabled?: boolean;
  onInspect?: () => void;
}

export default function EmailSimulation({levelState, instructions, question, disabled, onInspect}: Props){
    const [showRealLink, setShowRealLink] = useState(false);
    const q = question as PhishingSimulationQuestion
    return(
      <View style={styles.container}>
          <Text style={styles.instructions}>{instructions}</Text>
          <View style={styles.emailWrapper}>
              <View style={styles.emailHeader}>
                  <View style={styles.avatar}>
                    <MaterialIcons name="person" size={22} color={Colors.text}></MaterialIcons>
                  </View>
                  <View>
                      <Text style={styles.from}>{q.email.from}</Text>
                      <Text style={styles.subject}>{q.email.subject}</Text>
                  </View>
              </View>

              <Text style={styles.body}>{q.email.body}</Text>

              {(q.email.display_link || q.url.full) && (
                  <Pressable disabled={disabled} onPress={onInspect} onLongPress={() => setShowRealLink(true)} style={({pressed}) => [styles.linkContainer, pressed && styles.linkPressed]}>
                      <View style={styles.linkBadge}>
                        <MaterialIcons name="search" size={14} color='white'></MaterialIcons>
                        <Text style={styles.linkBadgeText}> Toca para inspeccionar</Text>
                      </View>
                      
                      <Text style={styles.fakeLink}>{q.email.display_link || q.url.full}</Text>

                      {showRealLink && (<Text style={styles.realLink}>{q.url.full}</Text>)}
                  </Pressable>
              )}
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  instructions: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
emailWrapper:{
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: Colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  from: {
    fontWeight: '600',
    fontSize: 14,
  },
  subject: {
    fontWeight: '700',
    fontSize: 16,
  },
  body: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  fakeLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  realLink: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.shadowSuspicious,
  },
  linkContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: 'rgba(0,122,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
  },
  linkPressed: {
    backgroundColor: 'rgba(0,122,255,0.15)'
  },
  linkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 5,
  },
  linkBadgeText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});