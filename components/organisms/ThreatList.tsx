import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


export const ThreatList = ({ threats }) => {
  const animatedValues = useRef(threats.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = threats.map((threat, index) => {
      return Animated.spring(animatedValues[index], {
        toValue: threat.distance * -10, // Adjust the multiplier as needed
        useNativeDriver: false,
      });
    });
    // Start all animations
    Animated.stagger(100, animations).start();
    // Cleanup on component unmount
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [threats, animatedValues]);
  

  return (
    <View>
      {threats.map((threat, index) => (
        <Animated.View key={threat.id} style={{ marginTop: animatedValues[index] }}>
          <Icon name="car" size={50} color="white" />
          <Text>Threat ID: {threat.id}</Text>
          <Text>Distance: {threat.distance}</Text>
          <Text>Speed: {threat.speed}</Text>
        </Animated.View>
      ))}
    </View>
  );
};
