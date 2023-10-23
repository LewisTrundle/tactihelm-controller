import { SafeAreaView, StatusBar, View, Text, TouchableWithoutFeedback } from "react-native";
import { useEffect, useState } from "react";
import { useBLE, permissions, Device } from "../hooks";
import { OpacityButton, ItemList } from "../components";
import { deviceScreenStyles } from "../styles";
import Icon from 'react-native-vector-icons/Ionicons';


const DeviceScreen = ({ navigation }) => {
  const { startBleScan, stopBleScan, connectToDevice, disconnectFromDevice, allDevices, connectedBleDevice } = useBLE();
  const { requestPermissions } = permissions();

  const [selectedDevice, setSelectedDevice] = useState<null | Device>(null);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      startBleScan();
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
    if (connectedBleDevice) {
      console.log("ATTEMPTING DISCONNECT FROM ", connectedBleDevice?.name);
      await disconnectFromDevice(connectedBleDevice);
    } else {
      console.log("ATTEMPTING CONNECT TO ", selectedDevice?.name);
      await connectToDevice(selectedDevice);
    }
  };

  useEffect(() => {
    scanForDevices();
    return () => stopBleScan();
  }, []);


  return (
    <TouchableWithoutFeedback onPress={() => setSelectedDevice(null)}>
      <SafeAreaView style={deviceScreenStyles.container}>
        <StatusBar />
        {connectedBleDevice ? (
          <View style={deviceScreenStyles.devicesContainer}>
            <View style={deviceScreenStyles.deviceIconContainer}>
              <Icon name={"bluetooth"} size={100} color={"white"} />
            </View>
            <Text style={deviceScreenStyles.deviceInfoText}>Name: {connectedBleDevice.name}</Text>
            <Text style={deviceScreenStyles.deviceInfoText}>ID: {connectedBleDevice.id}</Text>
            <Text style={deviceScreenStyles.deviceInfoText}>RSSI: {connectedBleDevice.rssi}</Text>
          </View>
        ) : (
          <View style={deviceScreenStyles.devicesContainer}>
            {allDevices.length == 0 && (
              <Text style={deviceScreenStyles.discoveryMessage}>Looking for devices</Text>
            )}
              <ItemList 
                items={allDevices}
                style={"secondary"}
                onPress={handleItemPress}
                selectedItem={selectedDevice}
              />
          </View>
        )}

        <View style={deviceScreenStyles.buttonsContainer}>
          <OpacityButton 
            text={`${connectedBleDevice ? 'Disconnect from' : 'Connect to'} ${selectedDevice ? selectedDevice.name : 'device'}`}
            onPress={()=>handleConnectPress()}
            style={"primary"}
            disabled={selectedDevice == null}
          />
          {connectedBleDevice && (
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