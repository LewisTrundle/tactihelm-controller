import { useState } from "react";
import { View } from "react-native";
import ToggleSwitch from 'toggle-switch-react-native';

type Size = "small" | "medium" | "large";

type CustomToggleSwitchProps = {
  isOn?: boolean;
  label?: string;
  size?: Size;
  onToggle?: any;
  containerStyle?: any;
  labelStyle?: any;
  offState?: any;
  onState?: any;
}

export const CustomToggleSwitch = ({ isOn, label, size, onToggle, containerStyle, labelStyle, offState, onState }: CustomToggleSwitchProps) => {
  const [isToggleOn, setIsToggleOn] = useState<boolean>(false);
  
  return (
    <View style={containerStyle}>
      <ToggleSwitch
        isOn={isOn ? isOn : isToggleOn}
        onColor="green"
        offColor="red"
        label={label}
        labelStyle={labelStyle}
        size={size}
        onToggle={isOn => {
          setIsToggleOn(isOn)
          onToggle(isOn ? onState : offState);
        }}
        disabled={false}
        animationSpeed={200}
      />
    </View>
  )
};