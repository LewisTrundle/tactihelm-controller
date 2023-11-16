import { View } from 'react-native';
import { useState } from "react";
import { debugStyles }  from '../../styles';
import { Input } from 'react-native-elements';
import { AlertModal } from "../molecules/AlertModal";
import { IconButton } from "../atoms/IconButton";
import { TactorSlider } from '../atoms/TactorSlider';

type DebugHelmetModalProps = {
  title?: string
  children?: any
  visible?: boolean
  onClose?: () => void
  confirmText?: string
  sendData?: any
  device?: any
};

export const DebugHelmetModal = ({title, visible, onClose, confirmText, sendData, device}: DebugHelmetModalProps) => {
  const [textValue, setTextValue] = useState('');

  const sendCommand = async (value: String) => {
    await sendData(device.bluetoothDevice, value);
  }

  return (
    <AlertModal
      title={title}
      visible={visible}
      onClose={onClose}
      confirmText={confirmText}
    >
      <View style={debugStyles.container}>
        <TactorSlider tactorID={1} onSlidingComplete={sendCommand}/>
        <TactorSlider tactorID={2} onSlidingComplete={sendCommand}/>
        <TactorSlider tactorID={3} onSlidingComplete={sendCommand}/>
        <TactorSlider tactorID={4} onSlidingComplete={sendCommand}/>

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