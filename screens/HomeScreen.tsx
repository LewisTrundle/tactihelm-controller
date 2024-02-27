import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from "react";
import { useBLE, useBC, usePermissions, useVibrationCommand, enumToArray } from '../utils';
import { AlertModal, OpacityButton, CustomSelectDropdown, CustomSlider } from "../components";
import { homeStyles, labStudyStyles } from "../styles";
import { BluetoothTypes, Scheme, Pattern } from "../constants";


const HomeScreen = ({ navigation }) => {
  const { connectedDevice: bleConnectedDevice, startListening, stopListening } = useBLE();
  const { connectedDevice: bcConnectedDevice, isBluetoothEnabled, bluetoothIsEnabled, requestBluetoothEnabled, writeToDevice } = useBC();
  const { arePermissionsGranted, requestPermissions, checkPermissions } = usePermissions();
  const { pattern, scheme, updateCommand, setAttributeUpdated, updateAttribute,
    commandTextRef, tactorRef } = useVibrationCommand();

  const [rideStarted, setRideStarted] = useState<boolean>(false);
  const [showConnectDevicesModal, setShowConnectedDevicesModal] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [distance, setDistance] = useState<string>('');
  const [lowThreshold, setLowThreshold] = useState<number>(0.6);
  const [highThreshold, setHighThreshold] = useState<number>(1.4);


  useEffect(() => {
    bluetoothIsEnabled(); 
    checkPermissions();
  }, []);


  useEffect(() => {
    setShowConnectedDevicesModal(false);
    updateCommand("WAVE")
  }, [isFocused]);


  const convertDistanceToCommand = (threat: any): void => {
    console.log(threat);
    if (!threat) return;

    const d = threat.followingDistance;
    let t;
    if (d <= lowThreshold) {
      t = "FRONT";
      setDistance("IMMINENT");
    } else if (d > lowThreshold && d <= highThreshold) {
      t = "MID";
      setDistance("NEAR");
    } else {
      t = "REAR";
      setDistance("FAR");
    }
    // if tactor is has changes, then send update command
    if (tactorRef.current != t) {
      updateCommand(t);
      const n_tactor: number = t=="REAR" ? 1 : t=="MID" ? 2 : 3;
      updateAttribute("repetitions", n_tactor)
      setAttributeUpdated(true);
      writeToDevice(commandTextRef.current);
    }
  };


  const startRide = (): void => {
    // if (!(bleConnectedDevice && bcConnectedDevice)) {
    //   setShowConnectedDevicesModal(true);
    //   return;
    // }
    setRideStarted(true);
    setDistance('Looking for vehicles')
    startListening(convertDistanceToCommand);
  };

  const endRide = (): void => {
    setRideStarted(false);
    setDistance('');
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

        <View style={labStudyStyles.dropdownsContainer}>
          <CustomSelectDropdown
            data={enumToArray(Pattern)}
            onSelect={updateCommand}
            buttonText="Select an option"
            defaultValue={Pattern[pattern]}
            buttonStyle={labStudyStyles.dropdownButton}
            containerStyle={labStudyStyles.dropdownContainer}
            title={"Pattern"}
            titleStyle={labStudyStyles.text}
          />
          <CustomSelectDropdown
            data={enumToArray(Scheme)}
            onSelect={updateCommand}
            buttonText="Select an option"
            defaultValue={Scheme[scheme]}
            buttonStyle={labStudyStyles.dropdownButton}
            containerStyle={labStudyStyles.dropdownContainer}
            title={"Duration Scheme"}
            titleStyle={labStudyStyles.text}
          />
        </View>

        <CustomSlider
          onSlidingComplete={setLowThreshold}
          startingValue={lowThreshold}
          minValue={5}
          maxValue={20}
          stepValue={1}
          alterValue={10}
        />
        <CustomSlider
          onSlidingComplete={setHighThreshold}
          startingValue={highThreshold}
          minValue={12}
          maxValue={40}
          stepValue={2}
          alterValue={10}
        />

        <Text style={homeStyles.distanceText}>{distance}</Text>
        
        <View style={homeStyles.rideButton}>
          <OpacityButton 
            text={`${rideStarted ? 'Stop' : 'Start'} Ride`}
            onPress={() => !rideStarted ? startRide() : endRide()}
            style={"primary"}
          />
        </View>
      </View>

      <View style={homeStyles.footerContainer}>
        <Text style={homeStyles.footerText}>Connected to bike radar: {bleConnectedDevice?.name}</Text>
        <Text style={homeStyles.footerText}>Connected to helmet: {bcConnectedDevice?.name}</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;