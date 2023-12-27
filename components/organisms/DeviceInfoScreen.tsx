import { SafeAreaView, StatusBar, View, Text, TouchableWithoutFeedback } from "react-native";
import { OpacityButton } from "../atoms/OpacityButton";
import { ItemList } from "../molecules/ItemList";
import { deviceScreenStyles } from "../../styles";
import Icon from 'react-native-vector-icons/Ionicons';


type DeviceInfoScreenProps = {
  connectedDevice: any;
  selectedDevice: any;
  deviceList: any[];
  handleItemPress: any;
  handleConnectPress: any;
  handleSettingsPress: any;
}

export const DeviceInfoScreen = ({connectedDevice, selectedDevice, deviceList, 
  handleItemPress, handleConnectPress, handleSettingsPress}: DeviceInfoScreenProps) => {

  return (
    <TouchableWithoutFeedback onPress={() => handleItemPress(null)}>
      <SafeAreaView style={deviceScreenStyles.container}>
        <StatusBar />
        {connectedDevice ? (
          <View style={deviceScreenStyles.devicesContainer}>
            <View style={deviceScreenStyles.deviceIconContainer}>
              <Icon name={"bluetooth"} size={100} color={"white"} />
            </View>
            <Text style={deviceScreenStyles.deviceInfoText}>Name: {connectedDevice.name}</Text>
            <Text style={deviceScreenStyles.deviceInfoText}>Address: {connectedDevice.id}</Text>
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
              onPress={()=>handleSettingsPress()}
              style={"primary"}
            />
          )}
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
};