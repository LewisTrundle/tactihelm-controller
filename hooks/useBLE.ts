/* eslint-disable no-bitwise */
import { useMemo, useState, useContext } from "react";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import { DeviceContext } from "./DeviceContextProvider";

import { Buffer } from "buffer";

const HEART_RATE_UUID = "6a4e3200-667b-11e3-949a-0800200c9a66";
const HEART_RATE_CHARACTERISTIC = "6a4e3203-667b-11e3-949a-0800200c9a66";

interface BluetoothLowEnergyApi {
  startBleScan(): void;
  stopBleScan(): void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectFromDevice: (device: Device) => void;
  getConnectedDevice: () => Device;
  allDevices: Device[];
  connectedBleDevice: Device | null;
  heartRate: number;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const { connectedBleDevice, setConnectedBleDevice } = useContext(DeviceContext);
  const [heartRate, setHeartRate] = useState<number>(0);

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const startBleScan = (): void =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(JSON.stringify(error));
      }
      if (device && device.name != null) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const stopBleScan = (): void => {
    bleManager.stopDeviceScan();
  };

  const BleDisconnectListener = (device: Device) =>
    bleManager.onDeviceDisconnected(device.id, (error: BleError, device: Device) => {
      if (error) {
        console.log(JSON.stringify(error));
      }
      setConnectedBleDevice(connectedBleDevice);
      console.log("BLUETOOTH CONNECTION TO" + device.name + " WAS DISCONNECTED");
    });


  const connectToDevice = async (device: Device): Promise<void> => {
    try {
      stopBleScan();
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedBleDevice(deviceConnection);
      BleDisconnectListener(deviceConnection);
      // await discoverDeviceServices(deviceConnection);
      // await startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT TO DEVICE", device?.name, JSON.stringify(e));
    }
  };

  const disconnectFromDevice = async (device: Device): Promise<void> => {
    try {
      const unconnectedDevice = await bleManager.cancelDeviceConnection(device.id);
      setConnectedBleDevice(null);
      setHeartRate(0);
    } catch (err) {
      console.log("FAILED TO DISCONNECT", JSON.stringify(err));
    }
  };

  const discoverDeviceServices = async (device: Device): Promise<void> => {
    try {
      console.log("Discovering device services")
      await device.discoverAllServicesAndCharacteristics();

      var servicesMap = {} as Record<string, any>;
      var services = await device.services();
      for (let service of services) {
        var characteristicsMap = {} as Record<string, any>;
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
      console.log("serv map is" + JSON.stringify(servicesMap))
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  };

  const getConnectedDevice = (): Device => {
    console.log("In here the connect device is ", connectedBleDevice?.name)
    setConnectedBleDevice(connectedBleDevice)
    return connectedBleDevice;
  }

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const data = characteristic.value;
    const binaryData = Buffer.from(data, "base64")
    console.log(binaryData, Buffer.byteLength(binaryData));
    
    const packetIdentifier = binaryData[0];
    for (let i = 1; i < binaryData.length; i+=3) {
      let id = binaryData[i];
      let distance = binaryData[i+1];
      let speed = binaryData[i+2];
      console.log("id: ",id + "\tdistance: "+distance + "\tspeed: "+speed)
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        HEART_RATE_UUID,
        HEART_RATE_CHARACTERISTIC,
        onHeartRateUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    startBleScan,
    stopBleScan,
    connectToDevice,
    disconnectFromDevice,
    getConnectedDevice,
    allDevices,
    connectedBleDevice,
    heartRate,
  };
}

export { useBLE, Device };