import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Animated } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = { //the parameters that the component use (properties)
    progressAnimation: Animated.Value;
    onClose: () => void;
};

export default function LevelHeader({progressAnimation, onClose}: Props){
    return(
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>X</Text>
        </Pressable>
        
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressBarFill, {width: progressAnimation.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%'],}),},]}></Animated.View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  closeIcon:{
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  progressBar:{
    width: '80%',
    height: 15,
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 60,
    marginHorizontal: 40,
    marginBottom: 10,
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#eccd1b',
    borderRadius: 20,
  }
})