import { SafeAreaView, StatusBar, Text, View, ScrollView, LogBox } from "react-native";
import { useState, useEffect } from "react";
import { Input } from 'react-native-elements';
import { CustomSelectDropdown, ItemList, CustomSlider, IconButton, CustomToggleSwitch, OpacityButton } from "../components";
import { useBC } from '../utils';
import { debugStyles, labStudyStyles } from "../styles";
import { Command, CommandStrings, Scheme, SchemeStrings, Tactor, TactorStrings, 
  Distance, DistanceStrings, Scenario, ScenarioStrings, enumToArray } from "../constants";

type ActivationType = "MANUAL" | "SENSOR";


const LabStudyScreen = () => {
  const { writeToDevice } = useBC();

  const [activationType, setActivationType] = useState<ActivationType>("MANUAL");

  const commands: CommandStrings[] = enumToArray(Command);
  const rhythmSchemes: SchemeStrings[] = enumToArray(Scheme);
  const tactors: TactorStrings[] = enumToArray(Tactor);
  const scenarios: ScenarioStrings[] = enumToArray(Scenario);
  const [command, setCommand] = useState<CommandStrings>(commands[0]);
  const [scheme, setScheme] = useState<SchemeStrings>(rhythmSchemes[0]);
  const [tactor, setTactor] = useState<TactorStrings>(tactors[0]);
  const [scenario, setScenario] = useState<ScenarioStrings>(scenarios[0]);

  const [intensity, setIntensity] = useState<number>(255);
  const [pulseDuration, setPulseDuration] = useState<number>(1_000);
  const [interStimulusInterval, setInterstimulusInterval] = useState<number>(500);
  const [repetitions, setRepetitions] = useState<number>(3);
  const [rhythmDelay, setRhythmDelay] = useState<number>(1000);
  const [cueDelay, setCueDelay] = useState<number>(5000);

  const [valuesEnforced, setValuesEnforced] = useState<boolean>(false);

  const [textValue, setTextValue] = useState('');

  const sendCommand = async (value: string) => {
    await writeToDevice(value);
  };

  const updateCommand = (text?: string) => {
    setTextValue(text ? text : `${command.toUpperCase()}:${(tactor as string).toUpperCase()},I${intensity},D${pulseDuration},S${interStimulusInterval},R${repetitions},L${rhythmDelay}`);
  };

  const enforceValues = () => {
    const enforceRepetitions = () => {
      const n_tactor: number = Tactor[tactor];
      setRepetitions(n_tactor+1);
    };
    const enforceCueDelay = () => {
      const n_tactor: number = Tactor[tactor];
      setCueDelay(n_tactor == 0 ? 20_000 : n_tactor == 1 ? 10_000 : 5_000);
    };

    const n_scheme: number = Scheme[scheme];
    switch (n_scheme) {
      case 0:
        setValuesEnforced(false);
        return;
      case 1:
        setCueDelay(10_000);
        break;
      case 2:
        enforceCueDelay();
        break;
      case 3:
        // need actual values for following distance to do this
        setCueDelay(500);
        break;
    }
    setValuesEnforced(true);
    enforceRepetitions();
  };

  const updateScenario = (scene: ScenarioStrings) => {
    setScenario(scene);
  }

  const playScenario = (scene: ScenarioStrings) => {
    console.log("Now playing scenario " + scene)
    setTactor("FRONT");
  };

  useEffect(() => {
    enforceValues();
  }, [scheme, tactor]);

  useEffect(() => {
    updateCommand();
  }, [command, tactor, intensity, pulseDuration, interStimulusInterval, repetitions, rhythmDelay]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);


  return (
    <SafeAreaView style={labStudyStyles.container}>
    <ScrollView>
      <StatusBar />

      <Text style={labStudyStyles.text}>Command & Scheme</Text>
      <View style={labStudyStyles.dropdownsContainer}>
        <CustomSelectDropdown
          data={commands}
          onSelect={setCommand}
          buttonText="Select an option"
          defaultValue={command}
          buttonStyle={labStudyStyles.dropdownButton}
        />
        <CustomSelectDropdown
          data={rhythmSchemes}
          onSelect={setScheme}
          buttonText="Select an option"
          defaultValue={scheme}
          buttonStyle={labStudyStyles.dropdownButton}
        />
      </View>
    
      <CustomToggleSwitch
        label={`Activation Type: ${activationType}`}
        size={"medium"}
        onToggle={() => setActivationType(activationType == "MANUAL" ? "SENSOR" : "MANUAL")}
        containerStyle={labStudyStyles.toggleSwitchContainer}
        labelStyle={labStudyStyles.toggleSwitchLabel}
      />
      <View style={labStudyStyles.listContainer}>
      {activationType == "MANUAL" ? (
        <ItemList 
          items={tactors}
          style={"tertiary"}
          onPress={setTactor}
          selectedItem={tactor}
          horizontal={true}
        />
      ) : (
        <ItemList 
          items={scenarios}
          style={"tertiary"}
          onPress={updateScenario}
          selectedItem={scenario}
          horizontal={true}
        />
      )}
      </View>

      <Text style={labStudyStyles.text}>Intensity</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>The strength of a vibration.</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>Recommended: 255</Text>
      <CustomSlider
        onSlidingComplete={setIntensity}
        startingValue={intensity}
        minValue={0}
        maxValue={255}
        stepValue={5}
        textColor={"white"}
        maxTrackColor={"red"}
      />
      <Text style={labStudyStyles.text}>Stimulus Duration (ms)</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>The length of a single stimuli.</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>Recommended: 1000</Text>
      <CustomSlider
        onSlidingComplete={setPulseDuration}
        startingValue={pulseDuration}
        minValue={100}
        maxValue={5_000}
        stepValue={100}
        textColor={"white"}
        maxTrackColor={"red"}
      />
      <Text style={labStudyStyles.text}>Inter-Stimulus Interval (ms)</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>The time between consecutive stimuli in a rhythm.</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>Recommended: 500</Text>
      <CustomSlider
        onSlidingComplete={setInterstimulusInterval}
        startingValue={interStimulusInterval}
        minValue={100}
        maxValue={2_000}
        stepValue={100}
        textColor={"white"}
        maxTrackColor={"red"}
      />
      <Text style={labStudyStyles.text}>Rhythm Duration / Repetitions</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>The number of times a rhythm is repeated consecutively.</Text>
      {activationType=="MANUAL" ? (
        <Text style={labStudyStyles.valueText}>{repetitions}</Text>
      ) : valuesEnforced ? (
        <Text style={[labStudyStyles.valueText]}>Will vary during scenario.</Text>
      ) : (
        <CustomSlider
          onSlidingComplete={setRepetitions}
          startingValue={repetitions}
          minValue={1}
          maxValue={10}
          stepValue={1}
          textColor={"white"}
          maxTrackColor={"red"}
        />
      )}

      <Text style={labStudyStyles.text}>Inter-Rhythm Interval / Rhythm Delay (ms)</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>The time between consecutive rhythms in a cue.</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>Recommended: 1000</Text>
      <CustomSlider
        onSlidingComplete={setRhythmDelay}
        startingValue={rhythmDelay}
        minValue={50}
        maxValue={2_000}
        stepValue={50}
        textColor={"white"}
        maxTrackColor={"red"}
      />
      <Text style={labStudyStyles.text}>Inter-Cue Interval / Cue Delay (ms)</Text>
      <Text style={[labStudyStyles.text, labStudyStyles.smallText]}>The time between consecutive cues</Text>
      {activationType=="MANUAL" ? (
        <Text style={labStudyStyles.valueText}>Not available with manual activation.</Text>
      ) : valuesEnforced ? (
        <Text style={[labStudyStyles.valueText]}>Will vary during scenario.</Text>
      ) : (
        <CustomSlider
          onSlidingComplete={setCueDelay}
          startingValue={cueDelay}
          minValue={0}
          maxValue={20_000}
          stepValue={100}
          textColor={"white"}
          maxTrackColor={"red"}
        />
      )}

      {activationType=="MANUAL" ? (
        <View style={debugStyles.sendTextContainer}>
          <View style={debugStyles.sendText}>
            <Input style={labStudyStyles.text} value={textValue} onChangeText={text => updateCommand(text)} />
          </View>
          <IconButton style={debugStyles.sendButton} onPress={() => sendCommand(textValue)} iconName={"send"} size={35} color={'#FC7A1E'} />
        </View>
      ) : (
        <OpacityButton 
          text={`Play ${scenario}`}
          style={"secondary"}
          onPress={() => playScenario(scenario)}
        />
      )}

    </ScrollView>
    </SafeAreaView>
  );
}

export default LabStudyScreen;