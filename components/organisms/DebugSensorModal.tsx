import { View, Text } from 'react-native';
import { useState } from "react";
import { OpacityButton } from '../atoms/OpacityButton';
import { AlertModal } from "../molecules/AlertModal";
import { useBLE } from "../../utils";
import { debugStyles }  from '../../styles';

type DebugSensorModalProps = {
  title?: string
  visible?: boolean
  onClose?: () => void
};

export const DebugSensorModal = ({title, visible, onClose}: DebugSensorModalProps) => {
  const { connectedDevice, getCharacteristicData } = useBLE();
  const [deviceName, setDeviceName] = useState<string>('');
  const [deviceAppearance, setDeviceAppearance] = useState<string>('');
  const [connectionParameters, setConnectionParameters] = useState<string>('');
  const [alertLevel, setAlertLevel] = useState<string>('');

  const getDeviceData = async (func: string, setData: any): Promise<void> => {
    const data = await getCharacteristicData(func);

    if (data) {
      setData(data);
    }
  }

  return (
    <AlertModal
      title={title}
      visible={visible}
      onClose={onClose}
    >
      <View style={debugStyles.container}>
        <OpacityButton 
          text="Get Device Name"
          onPress={()=> getDeviceData("getDeviceName", setDeviceName)}
          style={"secondary"}
        />
        <Text>{deviceName}</Text>
        <OpacityButton 
          text="Get Appearance"
          onPress={()=> getDeviceData("getAppearance", setDeviceAppearance)}
          style={"secondary"}
        />
        <Text>{deviceAppearance}</Text>
        <OpacityButton 
          text="Get Connection Parameters"
          onPress={()=> getDeviceData("getConnectionParameters", setConnectionParameters)}
          style={"secondary"}
        />
        <Text>{connectionParameters}</Text>
        <OpacityButton 
          text="Get Alert Level"
          onPress={()=> getDeviceData("getCentralAddress", setAlertLevel)}
          style={"secondary"}
        />
        <Text>{alertLevel}</Text>
      </View>
    </AlertModal>
  )
};