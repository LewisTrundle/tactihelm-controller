import { BluetoothDevice } from '../hooks';
import { VibrationPattern } from './VibrationPattern';

export class Helmet {
  bluetoothDevice: BluetoothDevice;
  name: String;
  address: String;
  vibrationPattern: VibrationPattern;

  constructor(bluetoothDevice: BluetoothDevice) {
    this.bluetoothDevice = bluetoothDevice;
    this.name = bluetoothDevice.name;
    this.address = bluetoothDevice.address;
  }
};