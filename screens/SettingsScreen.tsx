import { SafeAreaView, StatusBar, Linking } from "react-native";
import { useState } from "react";
import { OpacityButton, DebugHelmetModal, DebugSensorModal, CommandOptionsModal } from "../components";
import { useBC } from '../utils';
import { settingsScreenStyles } from "../styles";


const SettingsScreen = ({ navigation }) => {
  const { openBluetoothSettings } = useBC();
  const [isDebugSensorModalOpen, setIsDebugSensorModalOpen] = useState<boolean>(false);
  const [isDebugHelmetModalOpen, setIsDebugHelmetModalOpen] = useState<boolean>(false);
  const [isCommandOptionsModalOpen, setIsCommandOptionsModalOpen] = useState<boolean>(false);


  return (
    <SafeAreaView style={settingsScreenStyles.container}>
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
      />
      <CommandOptionsModal
        title="Set Command Options"
        visible={isCommandOptionsModalOpen}
        onConfirm={() => setIsCommandOptionsModalOpen(false)}
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
      <OpacityButton 
        text="Lab Study"
        onPress={()=> navigation.navigate("LabStudy")}
        style={"primary"}
      />
      <OpacityButton 
        text="Set Command Options"
        onPress={()=> setIsCommandOptionsModalOpen(true)}
        style={"primary"}
      />
    </SafeAreaView>
  );
}

export default SettingsScreen;