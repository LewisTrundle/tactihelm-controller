import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, DeviceScreen, SettingsScreen } from './screens';
import { IconButton } from './components/atoms/IconButton';
import { DeviceContextProvider } from './hooks/DeviceContextProvider';
import { BluetoothTypes } from './constants/BluetoothTypes';

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
              <IconButton iconName="bluetooth" onPress={()=>navigation.navigate("Device", {conn: BluetoothTypes.BLE})} size={30} color="black" />
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