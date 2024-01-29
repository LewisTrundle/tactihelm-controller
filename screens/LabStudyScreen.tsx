import { SafeAreaView, StatusBar, View, ScrollView, LogBox, Text } from "react-native";
import { useEffect, useState } from "react";
import { Input } from 'react-native-elements';
import { CustomSelectDropdown, ItemList, IconButton, CustomToggleSwitch, OpacityButton, AttributeSlider } from "../components";
import { useBC, useBLE, useVibrationCommand, enumToArray, balancedLatinSquare } from '../utils';
import { debugStyles, labStudyStyles } from "../styles";
import { Pattern, Scheme, Tactor, Scenario, ActivationType } from "../constants";



const LabStudyScreen = () => {
  const { connectedDevice: bcConnectedDevice, writeToDevice } = useBC();
  const { connectedDevice: bleConnectedDevice, getCharacteristicData, 
    removeServiceSubscription, threat } = useBLE();

  const { pattern, scheme, tactor, scenario, activationType, attributes, commandText,
    updatePattern, updateScheme, updateTactor, updateScenario, updateActivationType, updateAttribute, updateCommandText } = useVibrationCommand();
  let { intensity, stimulusDuration, isi, repetitions, rhythmDelay } = attributes;

  const [playingScenario, setPlayingScenario] = useState<boolean>(false);
  const [order, setOrder] = useState<string>('No order');

  
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const updateOrder = (participantId: number) => {
    const conditions: string[] = ["Singular Monotonic", "Singular Varying", "Wall Monotonic", "Wall Varying", "Wave Monotonic", "Wave Varying"];
    const o = balancedLatinSquare(conditions, participantId-1);
    setOrder(o.join('\n'));
  }
  
  const sendCommand = async (value: string) => {
    await writeToDevice(value);
  };

  const playScenario = (scene: Scenario) => {
    //if (!bcConnectedDevice) return;
    console.log("Now playing scenario " + scene);

    const delay = async (ms) => {
      return new Promise((resolve) => 
        setTimeout(resolve, ms));
    };

    const playReal = () => {
      if (bleConnectedDevice) {
        console.log("calling get sensor data")
        getCharacteristicData("getSensorData");
      } else {
        console.log("Please connect to sensor");
      }
    }
    const playScene1 = async () => {
      await delay(2000);
      console.log("hello")
    }

    setPlayingScenario(true);
    switch (scenario) {
      case Scenario.REAL:
        playReal();
        return;
      case Scenario.SCENE1:
        playScene1();
        break;
    }
    setPlayingScenario(false);
  };


  return (
    <SafeAreaView style={labStudyStyles.container}>
    <ScrollView>
      <StatusBar />
      <View style={labStudyStyles.dropdownsContainer}>
        <CustomSelectDropdown
          data={Array.from({ length: 20 }, (_, index) => index + 1)}
          onSelect={updateOrder}
          buttonText="Select Part. ID"
          buttonStyle={labStudyStyles.dropdownButton}
          containerStyle={labStudyStyles.dropdownContainer}
          title={"Condition Order"}
          titleStyle={labStudyStyles.text}
        />
        <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>{order}</Text>
      </View>

      <View style={labStudyStyles.dropdownsContainer}>
        <CustomSelectDropdown
          data={enumToArray(Pattern)}
          onSelect={updatePattern}
          buttonText="Select an option"
          defaultValue={Pattern[pattern]}
          buttonStyle={labStudyStyles.dropdownButton}
          containerStyle={labStudyStyles.dropdownContainer}
          title={"Pattern"}
          titleStyle={labStudyStyles.text}
        />
        <CustomSelectDropdown
          data={enumToArray(Scheme)}
          onSelect={updateScheme}
          buttonText="Select an option"
          defaultValue={Scheme[scheme]}
          buttonStyle={labStudyStyles.dropdownButton}
          containerStyle={labStudyStyles.dropdownContainer}
          title={"Duration Scheme"}
          titleStyle={labStudyStyles.text}
        />
      </View>
    
      <CustomToggleSwitch
        label={`Activation Type: ${ActivationType[activationType]}`}
        size={"medium"}
        onToggle={() => updateActivationType(activationType == ActivationType.MANUAL ? ActivationType.SENSOR : ActivationType.MANUAL)}
        containerStyle={labStudyStyles.toggleSwitchContainer}
        labelStyle={labStudyStyles.toggleSwitchLabel}
      />
      <View style={labStudyStyles.listContainer}>
      {activationType == ActivationType.MANUAL ? (
        <ItemList 
          items={enumToArray(Tactor)}
          style={"tertiary"}
          onPress={updateTactor}
          selectedItem={Tactor[tactor]}
          horizontal={true}
        />
      ) : (
        <ItemList 
          items={enumToArray(Scenario)}
          style={"tertiary"}
          onPress={updateScenario}
          selectedItem={Scenario[scenario]}
          horizontal={true}
        />
      )}
      </View>


      <AttributeSlider
        attribute={intensity}
        updateAttribute={updateAttribute}
      />
      <AttributeSlider
        attribute={stimulusDuration}
        updateAttribute={updateAttribute}
      />
      <AttributeSlider
        attribute={isi}
        updateAttribute={updateAttribute}
        renderCondition={pattern==Pattern.WAVE}
        altElement={0}
      />
      <AttributeSlider
        attribute={repetitions}
        updateAttribute={updateAttribute}
        renderCondition={scheme==Scheme.CUSTOM}
        altElement={repetitions.currentValue}
      />
      <AttributeSlider
        attribute={rhythmDelay}
        updateAttribute={updateAttribute}
      />


      {activationType==ActivationType.MANUAL ? (
        <View style={debugStyles.sendTextContainer}>
          <View style={debugStyles.sendText}>
            <Input style={labStudyStyles.text} value={commandText} onChangeText={text => updateCommandText(text)} />
          </View>
          <IconButton style={debugStyles.sendButton} onPress={() => sendCommand(commandText)} iconName={"send"} size={35} color={'#FC7A1E'} />
        </View>
      ) : (
        <OpacityButton 
          text={`${playingScenario ? 'Stop' : 'Play'} ${Scenario[scenario]}`}
          style={"secondary"}
          onPress={() => playingScenario ? removeServiceSubscription() : playScenario(scenario)}
        />
      )}

    </ScrollView>
    </SafeAreaView>
  );
}

export default LabStudyScreen;