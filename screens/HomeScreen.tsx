import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useEffect } from "react";
import { useBC, permissions, monitorSensor } from '../hooks';
import { AlertModal } from "../components";
import { homeStyles } from "../styles";
import { IconButton } from '../components/atoms/IconButton';
import { BluetoothTypes } from '../constants';

const HomeScreen = ({ navigation, GlobalState }) => {
  const { isBluetoothEnabled, bluetoothIsEnabled, requestBluetoothEnabled } = useBC();
  const { arePermissionsGranted, requestPermissions, checkPermissions } = permissions();
  const { startStreamingData, threats } = monitorSensor();

  const { sensor, setSensor, helmet, setHelmet } = GlobalState;

  useEffect(() => {
    bluetoothIsEnabled();
    checkPermissions();
    navigation.addListener('focus', payload => {
      sensor.bluetootDevice && startStreamingData(sensor.bluetoothDevice);

    });
    return () => {
      navigation.removeListener('focus');
    }
  }, []);

  useEffect(() => {
    console.log(threats)
  }, [threats])

  useEffect(() => {
    //console.log("connected sensor is ", sensor)
  }, [GlobalState])


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
        <IconButton iconName="basketball" onPress={()=>navigation.navigate("Device", {conn: BluetoothTypes.BC})} size={50} color="white" />
      </View>
      <View style={homeStyles.footerContainer}>
        <Text style={homeStyles.footerText}>Connect to bike radar: {sensor?.name}</Text>
        <Text style={homeStyles.footerText}>Connect to helmet: {helmet?.name}</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;