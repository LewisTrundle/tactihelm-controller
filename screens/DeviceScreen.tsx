import { useEffect } from "react";
import { useBLE, useBC, usePermissions, useSelectedItem } from "../utils";
import { DeviceInfoPage } from "../components";
import { BluetoothTypes } from "../constants";

const DeviceScreen = ({ navigation, route }) => {
  const isBLE = route.params.conn === BluetoothTypes.BLE;

  const { startScan, stopScan, handleConnectPress, deviceList, connectedDevice } = isBLE ? useBLE() : useBC();
  const { requestPermissions } = usePermissions();
  const { handleItemPress, selectedItem } = useSelectedItem();

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
    <DeviceInfoPage 
      connectedDevice={connectedDevice}
      selectedDevice={selectedItem}
      deviceList={deviceList}
      handleItemPress={handleItemPress}
      handleConnectPress={handleConnectPress}
      handleSettingsPress={() => navigation.navigate("Settings")}
    />
  )
};

export default DeviceScreen;