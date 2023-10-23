import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useEffect, useContext } from "react";
import { useBC, permissions } from '../hooks';
import { AlertModal } from "../components";
import { homeStyles } from "../styles";
import { DeviceContext } from "../hooks/DeviceContextProvider";

const HomeScreen = ({ navigation }) => {
  const { isBluetoothEnabled, bluetoothIsEnabled, requestBluetoothEnabled } = useBC();
  const { arePermissionsGranted, requestPermissions, checkPermissions } = permissions();
  const { connectedBleDevice } = useContext(DeviceContext);

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
        <Text style={homeStyles.footerText}>Connect to bike radar: {connectedBleDevice?.name}</Text>
      </View>
      <View style={homeStyles.footerContainer}>
        <Text style={homeStyles.footerText}>Connect to bike radar: {connectedBleDevice?.name}</Text>
        <Text style={homeStyles.footerText}>Connect to helmet: </Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;