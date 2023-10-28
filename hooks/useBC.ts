import { useState, useEffect, useContext } from "react";
import { Platform } from "react-native";
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { DeviceContext } from "./DeviceContextProvider";
import { BluetoothApi } from "./BluetoothApis";

interface BluetoothClassicApi extends BluetoothApi {
  isBluetoothSupported: boolean;
  isBluetoothEnabled: boolean;
  pairedDevices: BluetoothDevice[];
  deviceSupportsBluetooth(): Promise<void>;
  bluetoothIsEnabled(): Promise<void>;
  requestBluetoothEnabled(): Promise<void>;
  openBluetoothSettings(): void;
  getPairedDevices(): Promise<void>;
  writeToDevice(text: string): Promise<void>;
};


function useBC(): BluetoothClassicApi {
  const [deviceList, setDeviceList] = useState<BluetoothDevice[]>([]);
  const [isBluetoothSupported, setIsBluetoothSupported] = useState<boolean>(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);


  useEffect(() => {
    const bluetoothListener = RNBluetoothClassic.onStateChanged((event) => setIsBluetoothEnabled(event.enabled));
    return () => {
      bluetoothListener.remove();
    };
  }, []);

  const startScan = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        console.log("in discovery")
        const unpaired = await RNBluetoothClassic.startDiscovery();
        setDeviceList(unpaired)
        unpaired.forEach((device) => console.log(device.name, device.address, device.bonded));
      } catch (err) {
        console.error(err);
      }
    } else if (Platform.OS === 'ios') {
      console.log("ios platform");
    } else {
      console.log("unrecognised platform");
    }
  }

  const stopScan = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const cancelled = await RNBluetoothClassic.cancelDiscovery();
      } catch (err) {
        console.error(err);
      }
    } else if (Platform.OS === 'ios') {
      console.log("ios platform");
    } else {
      console.log("unrecognised platform");
    }
  }

  const connectToDevice = async (device: BluetoothDevice): Promise<void> => {
    try {
      const isConnected = await device.connect();
      console.log("device has been connected: ", isConnected)
    } catch (err) {
      console.log("FAILED TO CONNECT TO DEVICE", device?.name, JSON.stringify(err));
    }
  }

  const disconnectFromDevice = async (device: BluetoothDevice): Promise<void> => {
    try {
      const disconnected = await device.disconnect();
      console.log("device has been disconnected: " + disconnected)
    } catch (err) {
      console.log("FAILED TO DISCONNECT", JSON.stringify(err));
    }
  };

  const deviceSupportsBluetooth = async (): Promise<void> => {
    try {
      const available: boolean = await RNBluetoothClassic.isBluetoothAvailable();
      setIsBluetoothSupported(available);
      console.log("Is Bluetooth available: " + available);
    } catch (err) {
      console.error(err);
    }
  };

  const bluetoothIsEnabled = async (): Promise<void> => {
    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      setIsBluetoothEnabled(enabled)
      console.log("Is Bluetooth enabled: " + enabled);
    } catch (err) {
      console.error(err);
    }
  };

  const requestBluetoothEnabled = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
        setIsBluetoothEnabled(enabled);  
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("ios feature")
    }
  };

  const openBluetoothSettings = (): void => {
    try {
      RNBluetoothClassic.openBluetoothSettings();
    } catch (err) {
      console.error(err);
    }
  };

  const getPairedDevices = async (): Promise<void> => {
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      setPairedDevices(paired);
      console.log("Paired devices are:");
      paired.forEach((device) => console.log(device.name, device.address, device.bonded));
    } catch (err) {
        console.error(err);
    }
  };


  const writeToDevice = async (text: string): Promise<void> => {
    try {
      console.log(text)
      await RNBluetoothClassic.writeToDevice("98:D3:51:FD:A2:55", text);
    } catch (err) {
      console.log(err)
    }
  }

  return {
    deviceSupportsBluetooth,
    bluetoothIsEnabled,
    requestBluetoothEnabled,
    openBluetoothSettings,
    getPairedDevices,
    startScan,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    writeToDevice,
    deviceList,
    isBluetoothSupported,
    isBluetoothEnabled,
    pairedDevices,
  };
}

export { useBC, BluetoothDevice };