import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
    email: any;
    realUrl: string;
    disabled: boolean;
};

export default function EmailCard({email, realUrl, disabled}: Props){
    const [showRealLink, setShowRealLink] = useState(false);

    return(
        <View style={styles.emailWrapper}>
            <View style={styles.emailHeader}>
                <View style={styles.avatar}>
                  <MaterialIcons name="person" size={22} color={Colors.text}></MaterialIcons>
                </View>
                <View>
                    <Text style={styles.from}>{email.from}</Text>
                    <Text style={styles.subject}>{email.subject}</Text>
                </View>
            </View>

            <Text style={styles.body}>{email.body}</Text>

            {(email.display_link || realUrl) && (
                <Pressable disabled={disabled} onLongPress={() => setShowRealLink(true)}>
                    <Text style={styles.fakeLink}>{email.display_link || realUrl}</Text>

                    {showRealLink && (<Text style={styles.realLink}>{realUrl}</Text>)}
                </Pressable>
             )}
        </View>
    );
}

const styles = StyleSheet.create({
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
    color: Colors.startButton,
    marginTop: 12,
    fontWeight: '600',
  },
  realLink: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.shadowSuspicious,
  },
});