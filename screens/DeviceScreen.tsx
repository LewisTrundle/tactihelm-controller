import { useEffect } from "react";
import { useBLE, useBC, usePermissions } from "../utils";
import { DeviceInfoScreen } from "../components";
import { BluetoothTypes } from "../constants";

const DeviceScreen = ({ navigation, route }) => {
  const isBLE = route.params.conn === BluetoothTypes.BLE;

  const { startScan, stopScan, handleItemPress, handleConnectPress, 
    deviceList, connectedDevice, selectedDevice } = isBLE ? useBLE() : useBC();
  const { requestPermissions } = usePermissions();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      startScan();
    }
  };

  useEffect(() => {
    if (!connectedDevice) {
      scanForDevices();
    }
    return () => {stopScan()};
  }, []);


  return (
    <DeviceInfoScreen 
      connectedDevice={connectedDevice}
      selectedDevice={selectedDevice}
      deviceList={deviceList}
      handleItemPress={handleItemPress}
      handleConnectPress={handleConnectPress}
      handleSettingsPress={() => navigation.navigate("Settings")}
    />
  )
};

export default DeviceScreen;