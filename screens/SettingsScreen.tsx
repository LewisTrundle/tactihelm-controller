import { SafeAreaView, StatusBar, Linking } from "react-native";
import { useState } from "react";
import { OpacityButton, DebugModal } from "../components";
import { useEffect } from "react";
import { useBC } from '../hooks';
import { styles } from "../styles";


const SetingsScreen = ({ GlobalState }) => {
  const { openBluetoothSettings, writeToDevice } = useBC();
  const [isDebugModalOpen, setIsDebugModalOpen] = useState<boolean>(false);

  const { sensor, setSensor, helmet, setHelmet } = GlobalState;

  useEffect(() => {

  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <DebugModal
        title="Debug Mode"
        visible={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        confirmText="Enable Bluetooth"
        sendData={writeToDevice}
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
        text="Debug Mode"
        onPress={()=> setIsDebugModalOpen(true)}
        style={"primary"}
      />
    </SafeAreaView>
  );
}

export default SetingsScreen;