import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, DeviceScreen, SettingsScreen } from './screens';
import { IconButton } from './components/IconButton';
import { DeviceContextProvider } from './hooks/DeviceContextProvider';

const Stack = createNativeStackNavigator();

function App() {

  return (
    <DeviceContextProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Tactihelm",
            headerRight: () => (
              <IconButton iconName="settings-outline" onPress={()=>navigation.navigate("Settings")} size={30} color="black" />
            ),
            headerLeft: () => (
              <IconButton iconName="bluetooth" onPress={()=>navigation.navigate("Device")} size={30} color="black" />
            ),
            headerTitleAlign: 'center',

          })}
        />
        <Stack.Screen 
          name="Device" 
          component={DeviceScreen}
          options={({ navigation }) => ({
            title: "Connect to Bluetooth Device",
            headerRight: () => (
              <IconButton iconName="settings-outline" onPress={()=>navigation.navigate("Settings")} size={30} color="black" />
            ),
            headerTitleAlign: 'center'
          })}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={({ navigation }) => ({
            title: "Settings",
            headerTitleAlign: 'center'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </DeviceContextProvider>
  );
}

export default App;

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