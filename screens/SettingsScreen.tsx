import { Text, SafeAreaView, StatusBar, Linking } from "react-native";
import { OpacityButton } from "../components";
import { useBC } from '../hooks';
import { styles } from "../styles";

const SetingsScreen = () => {
  const { openBluetoothSettings } = useBC();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Text>Settings Screen</Text>
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
    </SafeAreaView>
  );
}

export default SetingsScreen;