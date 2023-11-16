import { createContext, useContext, useState } from "react";
import { Platform } from "react-native";
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

interface BluetoothClassicApi {
  startScan(): Promise<void>;
  stopScan(): Promise<void>;
  connectToDevice: (device: BluetoothDevice) => Promise<void>;
  disconnectFromDevice: () => Promise<void>;
  handleItemPress: (device: BluetoothDevice) => void;
  handleConnectPress: () => Promise<void>;
  deviceSupportsBluetooth(): Promise<void>;
  bluetoothIsEnabled(): Promise<void>;
  requestBluetoothEnabled(): Promise<void>;
  openBluetoothSettings(): void;
  getPairedDevices(): Promise<void>;
  writeToDevice(text: string): Promise<void>;
  deviceList: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  selectedDevice: BluetoothDevice | null;
  isBluetoothSupported: boolean;
  isBluetoothEnabled: boolean;
  pairedDevices: BluetoothDevice[];
};

const defaultContext: BluetoothClassicApi = {
  startScan: null,
  stopScan: null,
  connectToDevice: null,
  disconnectFromDevice: null,
  handleItemPress: null,
  handleConnectPress: null,
  deviceSupportsBluetooth: null,
  bluetoothIsEnabled: null,
  requestBluetoothEnabled: null,
  openBluetoothSettings: null,
  getPairedDevices: null,
  writeToDevice: null,
  deviceList: null,
  connectedDevice: null,
  selectedDevice: null,
  isBluetoothSupported: null,
  isBluetoothEnabled: null,
  pairedDevices: null,
};

const BCContext = createContext(defaultContext);


export const BCProvider = ({ children }) => {
  const [deviceList, setDeviceList] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [isBluetoothSupported, setIsBluetoothSupported] = useState<boolean>(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);

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
      setConnectedDevice(device);
      console.log("device has been connected: ", isConnected)
    } catch (err) {
      console.log("FAILED TO CONNECT TO DEVICE", device?.name, JSON.stringify(err));
    }
  }

  const disconnectFromDevice = async (): Promise<void> => {
    try {
      const disconnected = await connectedDevice.disconnect();
      setConnectedDevice(null);
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
      const parsedText = text.toLowerCase().replaceAll(' ', '');
      console.log("parsed text is ", parsedText);
      await RNBluetoothClassic.writeToDevice(connectedDevice.address, parsedText);
    } catch (err) {
      console.log(err)
    }
  };


  const handleItemPress = (device: (BluetoothDevice | null)): void => {
    if (selectedDevice === device) {
      setSelectedDevice(null);
    } else {
      setSelectedDevice(device);
    }
  };

  const handleConnectPress = async (): Promise<void> => {
    if (connectedDevice) {
      await disconnectFromDevice();
    } else {
      await connectToDevice(selectedDevice);
    }
  };

  const bcApi: BluetoothClassicApi = { startScan, stopScan, connectToDevice, 
    disconnectFromDevice, handleItemPress, handleConnectPress, deviceSupportsBluetooth, 
    bluetoothIsEnabled, requestBluetoothEnabled, openBluetoothSettings, getPairedDevices, 
    writeToDevice, deviceList, connectedDevice, selectedDevice, isBluetoothSupported, 
    isBluetoothEnabled, pairedDevices };


  return (
    <BCContext.Provider value={bcApi}>
      {children}
    </BCContext.Provider>
  );
};


export const useBC = () => {
  const helmet = useContext(BCContext);
  if (!helmet) {
    throw new Error('sensor must be used within a BLEProvider');
  }
  return helmet;
};