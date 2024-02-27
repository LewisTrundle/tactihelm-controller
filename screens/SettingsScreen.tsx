import { SafeAreaView, StatusBar, Linking } from "react-native";
import { useState } from "react";
import { OpacityButton, DebugHelmetModal, DebugSensorModal } from "../components";
import { useBC } from '../utils';
import { settingsScreenStyles } from "../styles";


const SetingsScreen = ({ navigation }) => {
  const { openBluetoothSettings } = useBC();
  const [isDebugSensorModalOpen, setIsDebugSensorModalOpen] = useState<boolean>(false);
  const [isDebugHelmetModalOpen, setIsDebugHelmetModalOpen] = useState<boolean>(false);


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
    </SafeAreaView>
  );
}

export default SetingsScreen;