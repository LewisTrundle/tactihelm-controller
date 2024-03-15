import { View, Text } from "react-native";
import { useState } from "react";
import Slider from '@react-native-community/slider';

type CustomSliderProps = {
  onSlidingComplete?: any;
  startingValue?: number;
  minValue?: number;
  maxValue?: number;
  stepValue?: number;
  textColor?: string;
  minTrackColor?: string;
  maxTrackColor?: string;
  alterValue?: number
}

export const CustomSlider = ({ onSlidingComplete, startingValue=0, minValue=0, maxValue=10, stepValue=1, 
  textColor="white", minTrackColor="white", maxTrackColor="black", alterValue=1 }: CustomSliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(startingValue);
  return (
    <View style={{flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: textColor}}>{sliderValue/alterValue}</Text>
      <Slider
        style={{width: "90%", height: 60}}
        value={sliderValue}
        minimumValue={minValue}
        maximumValue={maxValue}
        minimumTrackTintColor={minTrackColor}
        maximumTrackTintColor={maxTrackColor}
        step={stepValue}
        onValueChange={(value) => setSliderValue(value)}
        onSlidingComplete={(value) => onSlidingComplete ? onSlidingComplete(value/alterValue) : console.log(value)}
      />
    </View>
  )
};