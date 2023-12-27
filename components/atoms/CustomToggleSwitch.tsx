import { useState } from "react";
import ToggleSwitch from 'toggle-switch-react-native';

type CustomToggleSwitchProps = {
  switchID?: number
  onSlidingComplete?: (value: String) => Promise<void>
}

export const CustomToggleSwitch = ({ switchID, onSlidingComplete }: CustomToggleSwitchProps) => {
  const [isToggleOn, setIsToggleOn] = useState<boolean>(false);
  
  return (
    <ToggleSwitch
      isOn={isToggleOn}
      onColor="green"
      offColor="red"
      label="Example label"
      labelStyle={{ color: "black", fontWeight: "900" }}
      size="medium"
      onToggle={isOn => setIsToggleOn(isOn)}
      disabled={false}
      animationSpeed={200}
    />
  )
};