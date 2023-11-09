import { useState } from 'react';
import { Threat } from '../classes';
import { BleError, Characteristic, Device } from "react-native-ble-plx";


const UUID = "6a4e3200-667b-11e3-949a-0800200c9a66";
const CHARACTERISTIC = "6a4e3203-667b-11e3-949a-0800200c9a66";

function monitorSensor() {
  const [threats, setThreats] = useState({});

  const onSensorUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
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
        setThreats(delete threats[threat.id]);
      } else {
        setThreats(threats[threat.id] = threat);
      }
      console.log(this.threats);
      //console.log("id: ",id + "\tdistance: "+distance + "\tspeed: "+speed)
    }
  };

  const startStreamingData = async (device: Device): Promise<void> => {
    if (device) {
      await this.discoverDeviceServices(device);
      //window.setInterval(this.sendData.bind(this), 2000);
      const subscription = await device.monitorCharacteristicForService(UUID, CHARACTERISTIC, onSensorUpdate);
    } else {
      console.log("No Device Connected");
    }
  };

  return { startStreamingData, threats };
};

export { monitorSensor };