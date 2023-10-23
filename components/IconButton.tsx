import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


type IconButtonProps = {
  iconName: string
  onPress: any
  size?: number
  color?: string
}

export const IconButton = ({iconName, onPress, size=100, color="red"}: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  )
}