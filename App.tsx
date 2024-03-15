import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, DeviceScreen, SettingsScreen, LabStudyScreen } from './screens';
import { IconButton } from './components/atoms/IconButton';
import { BLEProvider, BCProvider, CommandProvider } from './utils';


function App() {
  const Stack = createNativeStackNavigator();

  return (
    <BLEProvider>
    <BCProvider>
    <CommandProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "TactiHelm",
            headerRight: () => (
              <IconButton iconName="settings-outline" onPress={()=>navigation.navigate("Settings")} size={30} color="black" />
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

        <Stack.Screen 
          name="LabStudy"
          component={LabStudyScreen}
          options={({ navigation }) => ({
            title: "Lab Study",
            headerTitleAlign: 'center'
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
    </CommandProvider>
    </BCProvider>
    </BLEProvider>
  );
}

export default App;