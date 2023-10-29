import { SafeAreaView, StatusBar, Linking } from "react-native";
import { useState } from "react";
import { OpacityButton, DebugModal } from "../components";
import { useBC } from '../hooks';
import { styles } from "../styles";


const SetingsScreen = () => {
  const { openBluetoothSettings, writeToDevice } = useBC();
  const [isDebugModalOpen, setIsDebugModalOpen] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <DebugModal
        title="Debug Mode"
        visible={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        confirmText="Enable Bluetooth"
        sendData={writeToDevice}
      />
      <OpacityButton 
        text="Open permissions"
        onPress={()=> Linking.openSettings()}
        style={"primary"}
      />
      <OpacityButton 
        text="Open Bluetooth Settings"
        onPress={()=> openBluetoothSettings()}
        style={"primary"}
      />
      <OpacityButton 
        text="Debug Mode"
        onPress={()=> setIsDebugModalOpen(true)}
        style={"primary"}
      />
    </SafeAreaView>
  );
}

export default SetingsScreen;


/*

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from "react";
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "./bluetooth/useBLE";
import useBC from "./bluetooth/useBC";
import { styles } from "./styles";

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
  } = useBLE();
  const {
    deviceSupportsBluetooth,
    bluetoothIsEnabled,
    getPairedDevices,
    discoverUnpairedDevices,
    connectToBluetoothDevice,
    writeToDevice,
    isBluetoothSupported,
    isBluetoothEnabled,
    pairedDevices,
    unpairedDevices
  } = useBC();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };


  const bluetoothSteps = async () => {
    await deviceSupportsBluetooth();
    await bluetoothIsEnabled();
    await getPairedDevices();
    await discoverUnpairedDevices(); 
    await connectToBluetoothDevice()
  }

  const sendCommand = async () => {
    console.log(inputValue);
    await writeToDevice(inputValue);
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} bpm</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Heart Rate Monitor
          </Text>
        )}
      </View>

      <View>
        <Input
            placeholder='Enter title...'
            onChangeText={text => setInputValue(text)}
        />
        <TouchableOpacity onPress={sendCommand} style={styles.ctaButton}>
          <Icon name={"send"} size={100} color={"red"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={bluetoothSteps}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          Classic Bluetooth
        </Text>
      </TouchableOpacity>

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};


export default function App() {
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen}/>
    </Stack.Navigator>
  </NavigationContainer>
}

*/