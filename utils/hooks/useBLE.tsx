import { createContext, useContext, useMemo, useState } from 'react';
import { BleManager, Device, BleError, Characteristic, Subscription } from "react-native-ble-plx";
import { getGattUUIDs } from '../helpers/getGattUUIDs';

interface Threat {
  id: number;
  distance: number;
  speed: number;
  followingDistance?: number;
};


interface BluetoothLowEnergyApi {
  startScan(): void;
  stopScan(): void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectFromDevice: (device: Device) => Promise<void>;
  handleConnectPress: (device: Device) => Promise<void>;
  getCharacteristicData: (func: string) => Promise<string | number | null>;
  removeServiceSubscription: () => void;
  deviceList: Device[];
  connectedDevice: Device | null;
  threat: any;
};

const defaultContext: BluetoothLowEnergyApi = {
  startScan: null,
  stopScan: null,
  connectToDevice: null,
  disconnectFromDevice: null,
  handleConnectPress: null,
  getCharacteristicData: null,
  removeServiceSubscription: null,
  deviceList: null,
  connectedDevice: null,
  threat: null,
};

const BLEContext = createContext(defaultContext);

export const BLEProvider = ({ children }) => {
  const bleManager = useMemo(() => new BleManager(), []);
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [services, setServices] = useState<Record<string, any>>(null);
  const [serviceSubscription, setServiceSubscription] = useState<Subscription>(null);
  const [threat, setThreat] = useState<Threat | null>(null);


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
      const deviceConnection = await bleManager.connectToDevice(device.id);
      await discoverDeviceServices(deviceConnection);
      setConnectedDevice(deviceConnection);
      stopScan();
    } catch (e) {
      console.log("FAILED TO CONNECT TO DEVICE", device?.name, JSON.stringify(e));
    }
  };

  const disconnectFromDevice = async (): Promise<void> => {
    try {
      const unconnectedDevice = await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      console.log("device has been disconnected: " + unconnectedDevice)
    } catch (err) {
      console.log("FAILED TO DISCONNECT", JSON.stringify(err));
    }
  };

  const discoverDeviceServices = async (device: Device): Promise<void> => {
    try {
      await device.discoverAllServicesAndCharacteristics();

      var servicesMap: Record<string, any> = {}; 
      var s = await device.services();
      for (let service of s) {
        var characteristicsMap: Record<string, any> = {};
        var characteristics = await service.characteristics();
        for (let characteristic of characteristics) {
          characteristicsMap[characteristic.uuid] = {
            uuid: characteristic.uuid,
            isReadable: characteristic.isReadable,
            isWritableWithResponse: characteristic.isWritableWithResponse,
            isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
            isNotifiable: characteristic.isNotifiable,
            isNotifying: characteristic.isNotifying,
            value: characteristic.value,
          };
        }
        servicesMap[service.uuid] = {
          uuid: service.uuid,
          isPrimary: service.isPrimary,
          characteristicsCount: characteristics.length,
          characteristics: characteristicsMap,
        };
      }
      setServices(servicesMap);
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  };

  
  // const updateThreats = (newThreat: Threat) => {
  //   setThreats((prevData) => {
  //     const existingObjectIndex = prevData.findIndex(obj => obj.id === newThreat.id);

  //     if (existingObjectIndex !== -1) {
  //       const preData = [...prevData];
  //       if (newThreat.distance <= 5) {
  //         preData.splice(existingObjectIndex, 1);     // remove threat
  //       } else {
  //         preData[existingObjectIndex] = newThreat;   // update threat
  //       }
  //       return preData;
  //     } else {
  //       if (newThreat.distance <= 5) {
  //         return [...prevData]
  //       } else {
  //         return [...prevData, newThreat];
  //       }
  //     }
  //   });
  // };


  const onSensorUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const binaryData = Buffer.from(characteristic.value, "base64");
    let threats: Threat[] = [];
    for (let i = 1; i < binaryData.length; i+=3) {
      let id = binaryData[i];
      let distance = binaryData[i+1];
      let speed = binaryData[i+2];
      let followingDistance = distance/speed;
      threats.push({id, distance, speed, followingDistance});
    };
    const t: Threat = threats.reduce((nearest, current) => {
      if (!nearest || current.distance < nearest.distance) {
        return current;
      } else {
        return nearest;
      }
    }, null);
    setThreat(t)
  };


  const decodeData = (func: string, value: string): (string | null) => {
    const getDeviceName = (value: string): string => {
      return Buffer.from(value, "base64").toString('utf-8');
    };
    const getAppearance = (value: string): string => {
      const categoryValue = Buffer.from(value, "base64").readUInt16LE(0);
      switch (categoryValue) {
        case 1152:
          return "Generic Cycling";
        default:
          return "Unknown type";
      };
    };
    const getConnectionParameters = (value: string): string => {
      const parameters = Buffer.from(value, "base64");
      const minimumConnectionInterval = (parameters.readUInt8(0) | parameters.readUInt8(1) << 8) * 1.25;
      const maximumConnectionInterval = (parameters.readUInt8(2) | parameters.readUInt8(3) << 8) * 1.25;
      const latency = parameters.readUInt8(4) | parameters.readUInt8(5) << 8;
      const supervisionTimeoutMultiplier = parameters.readUInt8(6) | parameters.readUInt8(7) << 8;
      const connectionInfo = `
        Minimum Connection Interval: ${minimumConnectionInterval}ms
        Maximum Connection Interval: ${maximumConnectionInterval}ms
        Latency: ${latency}ms
        Connection Supervision Timeout Multiplier: ${supervisionTimeoutMultiplier}`
      return connectionInfo;
    };
    const getCentralAddress = (value: string): string => {
      const supportedBit = Buffer.from(value, "base64").readUInt8(0);
      let supported = 'N/A';
      if (supportedBit === 0) supported = 'Not Supported';
      else if (supportedBit === 1) supported = 'Supported';
      return `Central Address Resolution: ${supported}`;
    };

    switch (func) {
      case "getDeviceName":
        return getDeviceName(value);
      case "getAppearance":
        return getAppearance(value)
      case "getConnectionParameters":
        return getConnectionParameters(value);
      case "getCentralAddress":
        return getCentralAddress(value);
      default:
        return null;
    }
  };

  const getCharacteristicData = async (func: string): Promise<string | null> => {
    if (connectedDevice) {
      const { service, characteristic } = getGattUUIDs(func);
      if (func === "getSensorData") {
        const subscription = await connectedDevice.monitorCharacteristicForService(service, characteristic, onSensorUpdate);
        setServiceSubscription(subscription);
      } else {
        const character = await connectedDevice.readCharacteristicForService(service, characteristic);
        return await decodeData(func, character.value);
      }
    } else {
      console.log("No Device Connected");
    }
  };

  const removeServiceSubscription = (): void => {
    serviceSubscription.remove();
    setServiceSubscription(null);
  }


  const handleConnectPress = async (device: Device): Promise<void> => {
    if (connectedDevice) {
      await disconnectFromDevice();
    } else {
      await connectToDevice(device);
    }
  };


  const bleApi: BluetoothLowEnergyApi = { startScan, stopScan, connectToDevice, 
    disconnectFromDevice, handleConnectPress, getCharacteristicData, removeServiceSubscription,
    deviceList, connectedDevice, threat };


  return (
    <BLEContext.Provider value={bleApi}>
      {children}
    </BLEContext.Provider>
  );
};

export const useBLE = () => {
  const sensor = useContext(BLEContext);
  if (!sensor) {
    throw new Error('sensor must be used within a BLEProvider');
  }
  return sensor;
};
