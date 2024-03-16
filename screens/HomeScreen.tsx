import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from "react";
import { useBLE, useBC, usePermissions, useVibrationCommand } from '../utils';
import { AlertModal, OpacityButton } from "../components";
import { homeStyles } from "../styles";
import { BluetoothTypes, Threat, Distance, Tactor } from "../constants";


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

  const startRideMessage: string = "Start a ride to start looking for vehicles";
  const [message, setMessage] = useState<string>(startRideMessage);
  const [threat, setThreat] = useState<Threat | null>(null);


  useEffect(() => {
    bluetoothIsEnabled(); 
    checkPermissions();
  }, []);


  useEffect(() => {
    setShowConnectedDevicesModal(false);
  }, [isFocused]);

  
  const parseThreat = (detectedThreat: Threat): void => {
    const getDistanceCategory = (fd: number, lt: number, ut: number): Distance => {
      if (fd <= lt) return Distance.IMMINENT;
      else if (fd > lt && fd <= ut) return Distance.NEAR;
      else return Distance.FAR;
    };
    const getTactorCategory = (dis: Distance): Tactor => {
      if (dis=="IMMINENT") return Tactor.FRONT;
      else if (dis=="NEAR") return Tactor.MID;
      else if (dis=="FAR") return Tactor.REAR;
    };

    if (!detectedThreat) return;
    let threat = calcFollowingDistance(detectedThreat);
    const dis = getDistanceCategory(threat.followingDistance, lowerThreshold.currentValue, upperThreshold.currentValue);
    const tac = getTactorCategory(dis);
    threat = { ... threat, ...{ distanceCategory: dis, tactor: tac }};

    // if tactor is has changes, then send update command
    let shouldVibrate = false;
    if (tactorRef.current != tac) {
      updateCommand(tac);
      const n_tactor: number = tac=="REAR" ? 1 : tac=="MID" ? 2 : 3;
      updateAttribute("repetitions", n_tactor);
      setAttributeUpdated(true);
      shouldVibrate = true;
      writeToDevice(commandTextRef.current);
    }
    threat = { ... threat, ...{ vibrate: shouldVibrate }};
    setThreat(threat);
  };


  const startRide = (): void => {
    if (!(bleConnectedDevice && bcConnectedDevice)) {
      setShowConnectedDevicesModal(true);
      return;
    }
    setRideStarted(true);
    setMessage('Looking for vehicles')
    startListening(parseThreat);
  };

  const endRide = (): void => {
    setRideStarted(false);
    setThreat(null);
    setMessage(startRideMessage);
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

        {threat ? (
          <View style={homeStyles.threatContent}>
            <Text style={homeStyles.distanceText}>{threat.distanceCategory}</Text>
            <Text style={[homeStyles.distanceText, homeStyles.threatText]}>ID: {threat.id}</Text>
            <Text style={[homeStyles.distanceText, homeStyles.threatText]}>Vibrate: {threat.vibrate ? 'Yes' : 'No'}</Text>
            <Text style={[homeStyles.distanceText, homeStyles.threatText]}>Distance: {threat.distanceMeters} ({threat.distanceMiles}) ({threat.distanceKilometers})</Text>
            <Text style={[homeStyles.distanceText, homeStyles.threatText]}>Speed: {threat.speedMS} ({threat.speedMPH}) ({threat.speedKMH})</Text>
            <Text style={[homeStyles.distanceText, homeStyles.threatText]}>Following Distance: {Number((threat.followingDistance / 1000).toFixed(1))} s</Text>
          </View>
        ) : (
          <Text style={homeStyles.distanceText}>{message}</Text>
        )}
        
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