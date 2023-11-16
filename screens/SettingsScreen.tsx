import { SafeAreaView, StatusBar, Linking } from "react-native";
import { useState } from "react";
import { OpacityButton, DebugHelmetModal, DebugSensorModal } from "../components";
import { useBC } from '../utils';
import { styles } from "../styles";


const SetingsScreen = () => {
  const { openBluetoothSettings, writeToDevice, connectedDevice: bcConnectedDevice } = useBC();
  const [isDebugSensorModalOpen, setIsDebugSensorModalOpen] = useState<boolean>(false);
  const [isDebugHelmetModalOpen, setIsDebugHelmetModalOpen] = useState<boolean>(false);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <DebugSensorModal
        title="Debug Sensor"
        visible={isDebugSensorModalOpen}
        onClose={() => setIsDebugSensorModalOpen(false)}
      />
      <DebugHelmetModal
        title="Debug Helmet"
        visible={isDebugHelmetModalOpen}
        onClose={() => setIsDebugHelmetModalOpen(false)}
        confirmText="Enable Bluetooth"
        sendData={writeToDevice}
        device={bcConnectedDevice}
      />
      <OpacityButton 
        text="Open permissions"
        onPress={()=> Linking.openSettings()}
        style={"primary"}
      />
      <OpacityButton 
        text="Open Bluetooth Settings"
        onPress={()=> openBluetoothSettings()}
        style={"primary"}
      />
      <OpacityButton 
        text="Debug Sensor"
        onPress={()=> setIsDebugSensorModalOpen(true)}
        style={"primary"}
      />
      <OpacityButton 
        text="Debug Helmet"
        onPress={()=> setIsDebugHelmetModalOpen(true)}
        style={"primary"}
      />
    </SafeAreaView>
  );
}

export default SetingsScreen;