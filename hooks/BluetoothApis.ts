import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { Device } from "react-native-ble-plx";


export interface BluetoothApi {
  startScan(): void | Promise<void>;
  stopScan(): void | Promise<void>;
  connectToDevice(device: Device | BluetoothDevice): Promise<void>;
  disconnectFromDevice(device: Device | BluetoothDevice): Promise<void>;
  deviceList: (Device | BluetoothDevice)[];
};