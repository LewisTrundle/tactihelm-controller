import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


type IconButtonProps = {
  iconName: string
  onPress: any
  size?: number
  color?: string
  style?: any
}

export const IconButton = ({iconName, onPress, style, size=100, color="red"}: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  )
}