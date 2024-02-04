import { SafeAreaView, StatusBar, View, ScrollView, LogBox, Text } from "react-native";
import { useEffect, useState } from "react";
import { Input } from 'react-native-elements';
import { CustomSelectDropdown, ItemList, IconButton, CustomToggleSwitch, OpacityButton, AttributeSlider } from "../components";
import { useBC, useVibrationCommand, useScenario, enumToArray, balancedLatinSquare } from '../utils';
import { debugStyles, labStudyStyles } from "../styles";
import { Pattern, Scheme, Tactor, Distance, Scenario, ActivationType } from "../constants";



const LabStudyScreen = () => {
  const { connectedDevice: bcConnectedDevice, writeToDevice } = useBC();
  const { pattern, scheme, tactor, scenario, activationType, attributes, commandText, updateCounter,
    updateAttribute, updateCommand, updateCommandText, setTactor } = useVibrationCommand();
  let { intensity, stimulusDuration, isi, repetitions, rhythmDelay } = attributes;
  const { playingScenario, scenarioActive, answer,
    playScenario, addAnswer, updateAnswer, submitAnswer } = useScenario();

  const [order, setOrder] = useState<string>('No order');

  
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [playingScenario]);

  const updateOrder = (participantId: number) => {
    const conditions: string[] = ["Singular Monotonic", "Singular Varying", "Wall Monotonic", "Wall Varying", "Wave Monotonic", "Wave Varying"];
    const o = balancedLatinSquare(conditions, participantId-1);
    setOrder(o.join('\n'));
  }

  const vibrate = () => {
    writeToDevice(commandText);
  };

  useEffect(() => {
    if (scenarioActive) {
      writeToDevice(commandText);
    }
  }, [updateCounter]);


  return (
    <SafeAreaView style={labStudyStyles.container}>
      <StatusBar />
      {playingScenario ? (
        <ScrollView>
          <Text style={[labStudyStyles.text, labStudyStyles.largeText]}>
            {scenarioActive ? `Now Playing Scenario: ${scenario}` : 'Finished, please submit answers'}
          </Text>

          {/* <View style={labStudyStyles.tactorsContainer}>
            <ItemList 
              items={enumToArray(Tactor)}
              style={"tertiary"}
              selectedItem={tactor}
              horizontal={true}
              canTouch={false}
            />
          </View> */}

          <View style={labStudyStyles.distancesContainer}>
            <ItemList 
              items={enumToArray(Distance).reverse()}
              style={"primary"}
              onPress={addAnswer}
              selectedItem={null}
              horizontal={false}
            />
          </View>

          <View style={debugStyles.sendTextContainer}>
            <View style={debugStyles.sendText}>
              <Input style={[labStudyStyles.text, labStudyStyles.largeText]} multiline={true}
                value={answer} onChangeText={text => updateAnswer(text)} />
            </View>
          </View>

          <OpacityButton 
            text={scenario==Scenario.PRACTICE ? "Stop" : "Submit Answers"}
            style={"secondary"}
            disabled={scenarioActive}
            onPress={() => submitAnswer()}
          />

        </ScrollView>
      ) : (
        <ScrollView>
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
        
          <CustomToggleSwitch
            isOn={activationType == ActivationType.SENSOR}
            label={`Activation Type: ${activationType}`}
            size={"medium"}
            onToggle={updateCommand}
            containerStyle={labStudyStyles.toggleSwitchContainer}
            labelStyle={labStudyStyles.toggleSwitchLabel}
            offState={ActivationType.MANUAL}
            onState={ActivationType.SENSOR}
          />
          <View style={labStudyStyles.listContainer}>
          {activationType == ActivationType.MANUAL ? (
            <ItemList 
              items={enumToArray(Tactor)}
              style={"tertiary"}
              onPress={updateCommand}
              selectedItem={tactor}
              horizontal={true}
            />
          ) : (
            <ItemList 
              items={enumToArray(Scenario)}
              style={"tertiary"}
              onPress={updateCommand}
              selectedItem={scenario}
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
              <IconButton style={debugStyles.sendButton} onPress={() => vibrate()} iconName={"send"} size={35} color={'#FC7A1E'} />
            </View>
          ) : (
            <OpacityButton 
              text={`${playingScenario ? 'Stop' : 'Play'} ${Scenario[scenario]}`}
              style={"secondary"}
              onPress={() => playScenario({scenario, bcConnectedDevice, updateCommand, setTactor})}
            />
          )}

        </ScrollView>
      )}

    </SafeAreaView>
  );
}

export default LabStudyScreen;