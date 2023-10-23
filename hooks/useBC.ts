import { useState, useEffect } from "react";
import { Platform } from "react-native";
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

interface BluetoothClassicApi {
  deviceSupportsBluetooth(): Promise<void>;
  bluetoothIsEnabled(): Promise<void>;
  requestBluetoothEnabled(): Promise<void>;
  openBluetoothSettings(): void;
  getPairedDevices(): Promise<void>;
  discoverUnpairedDevices(): Promise<void>;
  connectToBluetoothDevice(): Promise<void>;
  writeToDevice(text: string): Promise<void>;
  isBluetoothSupported: boolean;
  isBluetoothEnabled: boolean;
  pairedDevices: BluetoothDevice[];
  unpairedDevices: BluetoothDevice[];
}

function useBC(): BluetoothClassicApi {
  const [isBluetoothSupported, setIsBluetoothSupported] = useState<boolean>(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [unpairedDevices, setUnpairedDevices] = useState<BluetoothDevice[]>([]);
  const [inDiscovery, setInDiscovery] = useState<boolean>(false);


  useEffect(() => {
    const bluetoothListener = RNBluetoothClassic.onStateChanged((event) => setIsBluetoothEnabled(event.enabled));
    return () => {
      bluetoothListener.remove();
    };
  }, []);


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

  const discoverUnpairedDevices = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      setInDiscovery(true);
      try {
        const unpaired = await RNBluetoothClassic.startDiscovery();
        setUnpairedDevices(unpaired)
        console.log("Unpaired devices are:");
        unpaired.forEach((device) => console.log(device.name, device.address, device.bonded));
      } catch (err) {
        console.error(err);
      } finally {
        cancelBluetoothDiscovery();
      }
    } else if (Platform.OS === 'ios') {
      console.log("ios platform");
    } else {
      console.log("unrecognised platform");
    }
  }

  const cancelBluetoothDiscovery = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const cancelled = await RNBluetoothClassic.cancelDiscovery();
        setInDiscovery(false);
        console.log("cancelled discovery", cancelled);
      } catch (err) {
        console.error(err);
      }
    } else if (Platform.OS === 'ios') {
      console.log("ios platform");
    } else {
      console.log("unrecognised platform");
    }
  }

  const pairBluetoothDevice = async () => {
    try {
      const pairedDevice = await RNBluetoothClassic.pairDevice("98:D3:51:FD:A2:55");
      console.log("Is the new device paired: " + pairedDevice.name, pairedDevice.address, pairedDevice.bonded);
    } catch (err) {
      console.error(err); 
    }
  }

  const connectToBluetoothDevice = async (): Promise<void> => {
    try {
      const isConnected = await RNBluetoothClassic.connectToDevice("98:D3:51:FD:A2:55");
      console.log(" 98:D3:51:FD:A2:55 is connected: " + JSON.stringify(isConnected));
    } catch (err) {
      console.error(err);
    }
  }

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
    discoverUnpairedDevices,
    connectToBluetoothDevice,
    writeToDevice,
    isBluetoothSupported,
    isBluetoothEnabled,
    pairedDevices,
    unpairedDevices
  };
}

export default useBC;