import { useState } from "react";
import { View } from "react-native";
import ToggleSwitch from 'toggle-switch-react-native';

type Size = "small" | "medium" | "large";

type CustomToggleSwitchProps = {
  label?: string;
  size?: Size;
  onToggle?: any;
  containerStyle?: any;
  labelStyle?: any;
}

export const CustomToggleSwitch = ({ label, size, onToggle, containerStyle, labelStyle }: CustomToggleSwitchProps) => {
  const [isToggleOn, setIsToggleOn] = useState<boolean>(false);
  
  return (
    <View style={containerStyle}>
      <ToggleSwitch
        isOn={isToggleOn}
        onColor="green"
        offColor="red"
        label={label}
        labelStyle={labelStyle}
        size={size}
        onToggle={isOn => {
          setIsToggleOn(isOn)
          onToggle();
        }}
        disabled={false}
        animationSpeed={200}
      />
    </View>
  )
};