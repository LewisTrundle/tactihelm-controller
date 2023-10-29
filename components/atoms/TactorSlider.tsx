import { View, Text } from "react-native";
import { useState } from "react";
import Slider from '@react-native-community/slider';

type TactorSliderProps = {
  tactorID: number
  onSlidingComplete?: (value: String) => Promise<void>
}

export const TactorSlider = ({ tactorID, onSlidingComplete }: TactorSliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  return (
    <View style={{flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
      <Text>{sliderValue}</Text>
      <Slider
        style={{width: "100%", height: 80}}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        step={5}
        onValueChange={(value) => setSliderValue(value)}
        onSlidingComplete={(value) => onSlidingComplete(tactorID.toString() + ',' + value)}
      />
    </View>
  )
};