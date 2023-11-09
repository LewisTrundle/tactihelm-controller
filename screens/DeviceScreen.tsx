import { SafeAreaView, StatusBar, View, Text, TouchableWithoutFeedback } from "react-native";
import { useEffect, useState, useContext } from "react";
import { useBLE, useBC, permissions, Device, BluetoothDevice } from "../hooks";
import { OpacityButton, ItemList } from "../components";
import { deviceScreenStyles } from "../styles";
import { BluetoothTypes } from "../constants";
import Icon from 'react-native-vector-icons/Ionicons';
import { DeviceContext } from '../hooks/DeviceContextProvider';

import { Sensor, Helmet } from '../classes';


const DeviceScreen = ({ navigation, route, GlobalState }) => {
  const { conn } = route.params;
  const isBLE = conn === BluetoothTypes.BLE; 

  const { startScan, stopScan, connectToDevice, disconnectFromDevice, deviceList } = isBLE ? useBLE() : useBC();
  const { connectedBLEDevice, connectedBCDevice, setConnectedDevices } = useContext(DeviceContext);
  const [connectedDevice, setConnectedDevice] = useState(connectedBCDevice || connectedBLEDevice);
  const { requestPermissions } = permissions();
  const [selectedDevice, setSelectedDevice] = useState<null | Device | BluetoothDevice>(null);

  const { sensor, setSensor, helmet, setHelmet } = GlobalState;


  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      startScan();
    }
  };

  const handleItemPress = (device: Device): void => {
    if (selectedDevice === device) {
      setSelectedDevice(null);
    } else {
      setSelectedDevice(device);
    }
  };

  const handleConnectPress = async (): Promise<void> => {
    if (connectedDevice) {
      console.log("ATTEMPTING DISCONNECT FROM ", connectedDevice?.name);
      await disconnectFromDevice(connectedDevice);
      isBLE ? setConnectedDevices(null, connectedBCDevice) : setConnectedDevices(connectedBLEDevice, null);
    } else {
      console.log("ATTEMPTING CONNECT TO ", selectedDevice?.name);
      await connectToDevice(selectedDevice);
      isBLE ? setConnectedDevices(selectedDevice, connectedBCDevice) : setConnectedDevices(connectedBLEDevice, selectedDevice);
      isBLE && setSensor(new Sensor(selectedDevice))
    }
  };

  // Use appropriate BC functions
  useEffect(() => {
    if ((isBLE && !connectedBLEDevice) || (!isBLE && !connectedBCDevice)) {
      scanForDevices();
    }
    return () => {stopScan()};
  }, []);


  useEffect(() => {
    setConnectedDevice(isBLE ? connectedBLEDevice : connectedBCDevice);
    console.log(connectedBLEDevice?.name, connectedBCDevice?.name)
  }, [connectedBLEDevice, connectedBCDevice])


  return (
    <TouchableWithoutFeedback onPress={() => setSelectedDevice(null)}>
      <SafeAreaView style={deviceScreenStyles.container}>
        <StatusBar />
        {connectedDevice ? (
          <View style={deviceScreenStyles.devicesContainer}>
            <View style={deviceScreenStyles.deviceIconContainer}>
              <Icon name={"bluetooth"} size={100} color={"white"} />
            </View>
            <Text style={deviceScreenStyles.deviceInfoText}>Name: {connectedDevice.name}</Text>
            <Text style={deviceScreenStyles.deviceInfoText}>Address: {connectedDevice.address}</Text>
          </View>
        ) : (
          <View style={deviceScreenStyles.devicesContainer}>
            {deviceList.length == 0 && (
              <Text style={deviceScreenStyles.discoveryMessage}>Looking for devices, this may take a while</Text>
            )}
              <ItemList 
                items={deviceList}
                style={"secondary"}
                onPress={handleItemPress}
                selectedItem={selectedDevice}
              />
          </View>
        )}

        <View style={deviceScreenStyles.buttonsContainer}>
          <OpacityButton 
            text={`${connectedDevice ? 'Disconnect from' : 'Connect to'} ${selectedDevice ? selectedDevice.name : 'device'}`}
            onPress={()=>handleConnectPress()}
            style={"primary"}
            disabled={!(connectedDevice || selectedDevice)}
          />
          {connectedDevice && (
            <OpacityButton 
              text="Open Threat Level Mapping Settings"
              onPress={()=>navigation.navigate("Settings")}
              style={"primary"}
            />
          )}
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
};

export default DeviceScreen;