import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
    onPress: () => void;
};

export default function ContinueButton({onPress}: Props){
    return(
        <Pressable onPress={onPress} style={({pressed}) => [styles.wrapper, pressed && styles.wrappedPressed]}>
          <View style={styles.continue}>
            <Text style={styles.text}>Continuar</Text>
          </View>
        </Pressable>
    )
}

const styles =StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.shadowContinue, 
    borderRadius: 15,
    paddingBottom: 5,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  continue: {
    backgroundColor: Colors.continueButton,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continuePressed: {
    transform: [{translateY: 0}],
  },
  wrappedPressed: {
    paddingBottom: 0,
    transform: [{translateY: 5}],
  },
  text: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16
  },
})