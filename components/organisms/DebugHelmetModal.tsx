import { View } from 'react-native';
import { useState } from "react";
import { debugStyles }  from '../../styles';
import { Input } from 'react-native-elements';
import { AlertModal } from "../molecules";
import { IconButton } from "../atoms";
import { useBC } from '../../utils';

type DebugHelmetModalProps = {
  title?: string
  children?: any
  visible?: boolean
  onClose?: () => void
};

export const DebugHelmetModal = ({title, visible, onClose}: DebugHelmetModalProps) => {
  const { writeToDevice } = useBC();
  const [textValue, setTextValue] = useState('');

  const sendCommand = async (value: string) => {
    await writeToDevice(value);
  }

  return (
    <AlertModal
      title={title}
      visible={visible}
      onClose={onClose}
    >
      <View style={debugStyles.container}>

        <View style={debugStyles.sendTextContainer}>
          <View style={debugStyles.sendText}>
            <Input placeholder='Enter command...' onChangeText={text => setTextValue(text)} />
          </View>
          <IconButton style={debugStyles.sendButton} onPress={() => sendCommand(textValue)} iconName={"send"} size={25} color={'#FC7A1E'} />
        </View>
      </View>
    </AlertModal>
  )
};