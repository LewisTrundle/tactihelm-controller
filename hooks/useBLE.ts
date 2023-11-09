/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { BluetoothApi } from "./BluetoothApis";


interface BluetoothLowEnergyApi extends BluetoothApi {
  
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [deviceList, setDeviceList] = useState<Device[]>([]);


  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const startScan = (): void =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(JSON.stringify(error));
      }
      if (device && device.name != null) {
        setDeviceList((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const stopScan = (): void => {
    bleManager.stopDeviceScan();
  };

  const connectToDevice = async (device: Device): Promise<void> => {
    try {
      stopScan();
      const deviceConnection = await bleManager.connectToDevice(device.id);
    } catch (e) {
      console.log("FAILED TO CONNECT TO DEVICE", device?.name, JSON.stringify(e));
    }
  };

  const disconnectFromDevice = async (device: Device): Promise<void> => {
    try {
      const unconnectedDevice = await device.cancelConnection();
      console.log("device has been disconnected: " + unconnectedDevice)
    } catch (err) {
      console.log("FAILED TO DISCONNECT", JSON.stringify(err));
    }
  };

  return {
    startScan,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    deviceList,
  };
}

export { useBLE, Device };