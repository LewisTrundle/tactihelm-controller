import { GattServices, GattCharacteristics, GattFunction } from "../../constants";


type GattFunctionMappings = {
  [key: string]: { service: GattServices; characteristic: GattCharacteristics };
};


const gattFunctionMappings: GattFunctionMappings = {
  getDeviceName: { service: GattServices.GENERIC_ACCESS, characteristic: GattCharacteristics.DEVICE_NAME },
  getAppearance: { service: GattServices.GENERIC_ACCESS, characteristic: GattCharacteristics.APPEARANCE },
  getConnectionParameters: { service: GattServices.GENERIC_ACCESS, characteristic: GattCharacteristics.PERIPHERAL_PREFERRED_CONNECTION_PARAMETERS },
  getCentralAddress: { service: GattServices.GENERIC_ACCESS, characteristic: GattCharacteristics.CENTRAL_ADDRESS_RESOLUTION },

  getSensorData: { service: GattServices.BIKE_SENSOR, characteristic: GattCharacteristics.SENSOR_DATA },
}

export const getGattUUIDs = (func: string) => {
  return gattFunctionMappings[func as GattFunction] || null;
};