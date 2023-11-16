import { PermissionsAndroid, Platform } from "react-native";
import { useState } from "react";
import * as ExpoDevice from "expo-device";

type PermissionProps = {
  title: string
  message: string
  buttonPositive: string
};

interface PermissionsApi {
  requestPermissions(): Promise<boolean>
  checkPermissions(): Promise<boolean>
  arePermissionsGranted: boolean
}

function usePermissions(): PermissionsApi {
  const [arePermissionsGranted, setArePermissionsGranted] = useState(false);

  const scanPermission: PermissionProps = {
    title: "Scan Permission",
    message: "Bluetooth Low Energy requires Scanning",
    buttonPositive: "OK",
  };
  const connectPermission: PermissionProps = {
    title: "Connecting Permission",
    message: "Bluetooth Low Energy requires Connecting",
    buttonPositive: "OK",
  };
  const locationPermission: PermissionProps = {
    title: "Location Permission",
    message: "Bluetooth Low Energy requires Location",
    buttonPositive: "OK",
  };

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      scanPermission
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      connectPermission
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      locationPermission
    );
  
    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const checkAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
    const bluetoothConnectPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
    const fineLocationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  
    return (bluetoothScanPermission && bluetoothConnectPermission && fineLocationPermission);
  }

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          locationPermission
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setArePermissionsGranted(isGranted)
        return isGranted;
      } else {
        const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
        setArePermissionsGranted(isAndroid31PermissionsGranted)
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const checkPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        setArePermissionsGranted(granted)
        return granted;
      } else {
        const isAndroid31PermissionsGranted = await checkAndroid31Permissions();
        setArePermissionsGranted(isAndroid31PermissionsGranted)
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  return {
    requestPermissions,
    checkPermissions,
    arePermissionsGranted
  }
};

export default usePermissions;