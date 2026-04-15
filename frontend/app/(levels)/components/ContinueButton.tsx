import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
    onPress: () => void;
    color?: string; //optional
    shadow?: string,
    textColor?: string,
};

export default function ContinueButton({onPress, color, shadow, textColor}: Props){
    return(
        <Pressable onPress={onPress} style={({pressed}) => [styles.wrapper, shadow ? {backgroundColor: shadow} : null, pressed && styles.wrappedPressed]}>
          <View style={[styles.continue, color ? {backgroundColor: color} : null]}>
            <Text style={[styles.text, textColor ? {color: textColor} : null]}>Continuar</Text>
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