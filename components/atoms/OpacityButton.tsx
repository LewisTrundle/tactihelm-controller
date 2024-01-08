import { Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { buttonStyles } from '../../styles';

type OpacityButtonProps = {
  text: string
  onPress?: () => (void | Promise<void>)
  style?: string 
  disabled?: boolean
}

type ButtonTextStyles = keyof typeof buttonStyles; //buttonStyles.primaryButtonText | buttonStyles.secondaryButtonText;

export const OpacityButton = ({ text, onPress, style, disabled=false}: OpacityButtonProps) => {
  const [buttonStyle, setButtonStyle] = useState(buttonStyles.primaryButton);
  const [buttonTextStyle, setButtonTextStyle] = useState<ButtonTextStyles>(buttonStyles.primaryButtonText);
  const [buttonDisabledStyle, setButtonDisabledStyle] = useState(buttonStyles.buttonDisabled);
  
  const setStyles = () => {
    switch(style) {
      case "primary": {
        setButtonStyle(buttonStyles.primaryButton);
        setButtonTextStyle(buttonStyles.primaryButtonText);
        break;
      }
      case "secondary": {
        setButtonStyle(buttonStyles.secondaryButton);
        setButtonTextStyle(buttonStyles.secondaryButtonText);
        break;
      }
    }
  };

  useEffect(() => {
    setStyles();
  }, [])

  return (
    <TouchableOpacity onPress={onPress} style={[buttonStyle, disabled && buttonDisabledStyle]} disabled={disabled}>
      <Text style={buttonTextStyle}>{text}</Text>
    </TouchableOpacity>
  )
}