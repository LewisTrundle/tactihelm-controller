import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useEffect } from "react";
import { useBLE, useBC, usePermissions } from '../utils';
import { AlertModal, OpacityButton } from "../components";
import { homeStyles } from "../styles";
import { BluetoothTypes } from "../constants";


const HomeScreen = ({ navigation }) => {
  const { connectedDevice: bleConnectedDevice, getCharacteristicData, threat } = useBLE();
  const { connectedDevice: bcConnectedDevice, isBluetoothEnabled, bluetoothIsEnabled, requestBluetoothEnabled } = useBC();
  const { arePermissionsGranted, requestPermissions, checkPermissions } = usePermissions();

  useEffect(() => {
    bluetoothIsEnabled(); 
    checkPermissions();
  }, []);

  // useEffect(() => {
  //   if (bleConnectedDevice) { // && bcConnectedDevice) {
  //     console.log("calling get sensor data")
  //     getCharacteristicData("getSensorData");
  //   }
  // }, [bleConnectedDevice, bcConnectedDevice]);

  // useEffect(() => {
  //   //console.log(threat)
  // }, [threat])



  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar />
      <AlertModal
        title="Please enable Bluetooth to continue using the app."
        visible={!isBluetoothEnabled}
        onConfirm={() => requestBluetoothEnabled()}
        confirmText="Enable Bluetooth"
      >
      </AlertModal>
      <AlertModal
        title="Please enable the necessary permissions to continue using the app."
        visible={!arePermissionsGranted}
        onConfirm={async () => await requestPermissions()}
        confirmText="Enable permissions"
      >
      </AlertModal>
      <View style={homeStyles.contentContainer}>
        <OpacityButton 
          text="Connect to Sensor"
          onPress={() => navigation.navigate("Device", {conn: BluetoothTypes.BLE})}
          style={"secondary"}
        />
        <OpacityButton 
          text="Connect to Helmet"
          onPress={() => navigation.navigate("Device", {conn: BluetoothTypes.BC})}
          style={"secondary"}
        />
      </View>
      <View style={homeStyles.footerContainer}>
        <Text style={homeStyles.footerText}>Connect to bike radar: {bleConnectedDevice?.name}</Text>
        <Text style={homeStyles.footerText}>Connect to helmet: {bcConnectedDevice?.name}</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;