import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from "react";
import { useBLE, useBC, usePermissions, useVibrationCommand } from '../utils';
import { AlertModal, OpacityButton } from "../components";
import { homeStyles } from "../styles";
import { BluetoothTypes, Threat } from "../constants";


const HomeScreen = ({ navigation }) => {
  const { connectedDevice: bleConnectedDevice, startListening, stopListening } = useBLE();
  const { connectedDevice: bcConnectedDevice, isBluetoothEnabled, bluetoothIsEnabled, requestBluetoothEnabled, writeToDevice } = useBC();
  const { arePermissionsGranted, requestPermissions, checkPermissions } = usePermissions();
  const { attributes, pattern, scheme, updateCommand, setAttributeUpdated, 
    updateAttribute, commandTextRef, tactorRef, calcFollowingDistance, distanceUnits, speedUnits } = useVibrationCommand();
  let { lowerThreshold, upperThreshold } = attributes;

  const [rideStarted, setRideStarted] = useState<boolean>(false);
  const [showConnectDevicesModal, setShowConnectedDevicesModal] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [message, setMessage] = useState<string>('');


  useEffect(() => {
    bluetoothIsEnabled(); 
    checkPermissions();
  }, []);


  useEffect(() => {
    setShowConnectedDevicesModal(false);
  }, [isFocused]);

  
  const parseThreat = (detectedThreat: Threat): void => {
    const convertFollowingDistanceToCommand = (fd: number, lt: number, ut: number): void => {
      let tac;
      if (fd <= lt) tac = "FRONT";
      else if (fd > lt && fd <= ut) tac = "MID";
      else tac = "REAR";

      tac=="FRONT" ? setMessage("IMMINENT") : tac=="MID" ? setMessage("NEAR") : setMessage("FAR");
      // if tactor is has changes, then send update command
      if (tactorRef.current != tac) {
        updateCommand(tac);
        const n_tactor: number = tac=="REAR" ? 1 : tac=="MID" ? 2 : 3;
        updateAttribute("repetitions", n_tactor)
        setAttributeUpdated(true);
        writeToDevice(commandTextRef.current);
      }
    };

    if (!detectedThreat) return;
    const threat = calcFollowingDistance(detectedThreat);
    console.log(threat);
    convertFollowingDistanceToCommand(threat.followingDistance*1000, lowerThreshold.currentValue, upperThreshold.currentValue);
  };



  const startRide = (): void => {
    // if (!(bleConnectedDevice && bcConnectedDevice)) {
    //   setShowConnectedDevicesModal(true);
    //   return;
    // }
    setRideStarted(true);
    setMessage('Looking for vehicles')
    startListening(parseThreat);
  };

  const endRide = (): void => {
    setRideStarted(false);
    setMessage('');
    stopListening();
  };


  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar />
      <AlertModal
        title="Please enable Bluetooth to continue using the app."
        visible={!isBluetoothEnabled}
        onConfirm={() => requestBluetoothEnabled()}
        confirmText="Enable Bluetooth"
      />
      <AlertModal
        title="Please enable the necessary permissions to continue using the app."
        visible={!arePermissionsGranted}
        onConfirm={async () => await requestPermissions()}
        confirmText="Enable permissions"
      />
      <AlertModal
        title={`Please connect to ${!bleConnectedDevice ? 'Sensor' : 'Helmet'} to start your ride.`}
        visible={showConnectDevicesModal}
        onConfirm={() => !bleConnectedDevice ? navigation.navigate("Device", {conn: BluetoothTypes.BLE}) : navigation.navigate("Device", {conn: BluetoothTypes.BC})}
        confirmText={`Connect to ${!bleConnectedDevice ? 'Sensor' : 'Helmet'}`}
        onClose={() => setShowConnectedDevicesModal(false)}
      />

      <View style={homeStyles.contentContainer}>
        <View style={homeStyles.connectButtons}>
          <OpacityButton 
            text={`${bleConnectedDevice ? 'Disconnect sensor' : 'Connect Sensor'}`}
            onPress={() => navigation.navigate("Device", {conn: BluetoothTypes.BLE})}
            style={"secondary"}
          />
          <OpacityButton 
            text={`${bcConnectedDevice ? 'Disconnect Helmet' : 'Connect Helmet'}`}
            onPress={() => navigation.navigate("Device", {conn: BluetoothTypes.BC})}
            style={"secondary"}
          />
        </View>

        <Text style={homeStyles.distanceText}>{message}</Text>
        
        <View style={homeStyles.rideButton}>
          <OpacityButton 
            text={`${rideStarted ? 'Stop' : 'Start'} Ride`}
            onPress={() => !rideStarted ? startRide() : endRide()}
            style={"primary"}
          />
        </View>
      </View>

      <View style={homeStyles.footerContainer}>
        <Text style={homeStyles.footerText}>Bike Radar Name: {bleConnectedDevice?.name}</Text>
        <Text style={homeStyles.footerText}>Helmet Name: {bcConnectedDevice?.name}</Text>
        <Text style={homeStyles.footerText}>Vibration Pattern: {pattern} {scheme}</Text>
        <Text style={homeStyles.footerText}>Lower Threshold: {lowerThreshold.currentValue}ms and Upper Threshold: {upperThreshold.currentValue}ms</Text>
        <Text style={homeStyles.footerText}>Distance Units: {distanceUnits} and Speed Units: {speedUnits}</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;