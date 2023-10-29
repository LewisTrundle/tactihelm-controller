import { View } from 'react-native';
import { useState, useContext } from "react";
import { debugStyles }  from '../../styles';
import { AlertModal, IconButton } from "../index";
import { Input } from 'react-native-elements';
import { DeviceContext } from "../../hooks/DeviceContextProvider";
import { TactorSlider } from '../atoms/TactorSlider';

type DebugModalProps = {
  title?: string
  children?: any
  visible?: boolean
  onClose?: () => void
  confirmText?: string
  sendData?: any
};

export const DebugModal = ({title, visible, onClose, confirmText, sendData}: DebugModalProps) => {
  const [textValue, setTextValue] = useState('');
  const { connectedBCDevice } = useContext(DeviceContext);

  const sendCommand = async (value: String) => {
    await sendData(connectedBCDevice, value);
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