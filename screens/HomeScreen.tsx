import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useEffect, useContext } from "react";
import { useBC, permissions } from '../hooks';
import { AlertModal } from "../components";
import { homeStyles } from "../styles";
import { DeviceContext } from "../hooks/DeviceContextProvider";
import { IconButton } from '../components/IconButton';
import { BluetoothTypes } from '../constants/BluetoothTypes';

const HomeScreen = ({ navigation }) => {
  const { isBluetoothEnabled, bluetoothIsEnabled, requestBluetoothEnabled } = useBC();
  const { arePermissionsGranted, requestPermissions, checkPermissions } = permissions();
  const { connectedBLEDevice, connectedBCDevice } = useContext(DeviceContext);

  useEffect(() => {
    bluetoothIsEnabled();
    checkPermissions();
    navigation.addListener('focus', payload => {
    });
    return () => {
      navigation.removeListener('focus');
    }
  }, []);


  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar />
      <AlertModal
        title="Please enable Bluetooth to continue using the app."
        visible={!isBluetoothEnabled}
        onConfirm={() => requestBluetoothEnabled()}
        allowClose={false}
        confirmText="Enable Bluetooth"
      >
      </AlertModal>
      <AlertModal
        title="Please enable the necessary permissions to continue using the app."
        visible={!arePermissionsGranted}
        onConfirm={async () => await requestPermissions()}
        allowClose={false}
        confirmText="Enable permissions"
      >
      </AlertModal>
      <View style={homeStyles.contentContainer}>
        <IconButton iconName="basketball" onPress={()=>navigation.navigate("Device", {conn: BluetoothTypes.BC})} size={50} color="white" />
      </View>
      <View style={homeStyles.footerContainer}>
        <Text style={homeStyles.footerText}>Connect to bike radar: {connectedBLEDevice?.name}</Text>
        <Text style={homeStyles.footerText}>Connect to helmet: {connectedBCDevice?.name}</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;