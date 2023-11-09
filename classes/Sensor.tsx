import { Threat } from './Threat';
import { BleError, Characteristic, Device } from "react-native-ble-plx";

const UUID = "6a4e3200-667b-11e3-949a-0800200c9a66";
const CHARACTERISTIC = "6a4e3203-667b-11e3-949a-0800200c9a66";

export class Sensor {
  bluetoothDevice: any;
  name: String;
  address: String;
  services: Record<string, any>;
  threats: Record<Threat["id"], Threat>;

  constructor(bluetoothDevice: any) {
    this.bluetoothDevice = bluetoothDevice;
    this.name = bluetoothDevice.name;
    this.address = bluetoothDevice.id;
    this.services = {};
    this.threats = {};
    //this.startStreamingData(bluetoothDevice);
  };

  discoverDeviceServices = async (device: Device): Promise<void> => {
    try {
      await device.discoverAllServicesAndCharacteristics();

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
        this.services[service.uuid] = {
          uuid: service.uuid,
          isPrimary: service.isPrimary,
          characteristicsCount: characteristics.length,
          characteristics: characteristicsMap,
        };
      }
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  };

  onSensorUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const binaryData = Buffer.from(characteristic.value, "base64");
    for (let i = 1; i < binaryData.length; i+=3) {
      let id = binaryData[i];
      let distance = binaryData[i+1];
      let speed = binaryData[i+2];
      const threat = new Threat(id, distance, speed);
      if (distance <= 3) {
        delete this.threats[threat.id];
      } else {
        this.threats[threat.id] = threat;
      }
      //console.log(this.threats);
      //console.log("id: ",id + "\tdistance: "+distance + "\tspeed: "+speed)
    }
  };

  startStreamingData = async (device: Device): Promise<void> => {
    if (device) {
      await this.discoverDeviceServices(device);
      window.setInterval(this.sendData.bind(this), 2000);
      const subscription = await device.monitorCharacteristicForService(UUID, CHARACTERISTIC, this.onSensorUpdate);
    } else {
      console.log("No Device Connected");
    }
  };

  sendData = (): void => {
    //console.log(this.threats);
  };
};