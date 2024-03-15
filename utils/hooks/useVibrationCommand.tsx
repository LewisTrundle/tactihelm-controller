import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { getEnumType } from '../helpers/enumHelpers';
import { Pattern, Scheme, Tactor, ActivationType, AttributeList, Command, Threat, DistanceUnit, SpeedUnit } from "../../constants";

const Attributes: AttributeList = {
  intensity: { key: "intensity", name: "Intensity", description: "The strength of a vibration.", 
    defaultValue: 255, minValue: 0, maxValue: 255, step: 5, currentValue: 255},
  stimulusDuration: { key: "stimulusDuration", name: "Stimulus Duration", description: "The length of a single stimuli.", units: "ms", 
    defaultValue: 300, minValue: 0, maxValue: 1_000, step: 100, currentValue: 300},
  isi: { key: "isi", name: "Inter-Stimulus Interval", description: "The time between consecutive stimuli in a rhythm.", units: "ms", 
    defaultValue: 150, minValue: 0, maxValue: 500, step: 50, currentValue: 150},
  repetitions: { key: "repetitions", name: "Rhythm Duration / Repetitions", description: "The number of times a rhythm is repeated consecutively.", 
    defaultValue: 1, minValue: 0, maxValue: 10, step: 1, currentValue: 1},
  rhythmDelay: { key: "rhythmDelay", name: "Inter-Rhythm Interval / Rhythm Delay", description: "The time between consecutive rhythms in a cue.", units: "ms", 
    defaultValue: 100, minValue: 0, maxValue: 500, step: 50, currentValue: 100},
  lowerThreshold: { key: "lowerThreshold", name: "Lower Threshold", description: "The f.d. value which separates imminent from near.", units: "ms", 
    defaultValue: 1500, minValue: 500, maxValue: 2500, step: 100, currentValue: 1500},
  upperThreshold: { key: "upperThreshold", name: "Upper Threshold", description: "The f.d. value which separates near from far.", units: "ms", 
    defaultValue: 3000, minValue: 1000, maxValue: 5000, step: 100, currentValue: 3000},
};

interface VibrationCommandApi {
  pattern: Pattern;
  scheme: Scheme;
  tactor: Tactor;
  activationType: ActivationType;
  attributes: AttributeList;
  commandText: Command | string;
  updateCounter: number;
  updateAttribute: (key: string, value: number) => void;
  updateCommand: (parameter: any) => void;
  setTactor: any;
  updateCommandText: (text?: string) => void;
  setAttributeUpdated: any;
  commandTextRef: any;
  tactorRef: any
  calcFollowingDistance: (threat: Threat) => Threat;
  distanceUnits: DistanceUnit;
  speedUnits: SpeedUnit;
  setDistanceUnits: any;
  setSpeedUnits: any;
};

const defaultContext: VibrationCommandApi = {
  pattern: null,
  scheme: null,
  tactor: null,
  activationType: null,
  attributes: null,
  commandText: null,
  updateCounter: null,
  updateAttribute: null,
  updateCommand: null,
  setTactor: null,
  updateCommandText: null,
  setAttributeUpdated: null,
  commandTextRef: null,
  tactorRef: null,
  calcFollowingDistance: null,
  distanceUnits: null,
  speedUnits: null,
  setDistanceUnits: null,
  setSpeedUnits: null,
};


const CommandContext = createContext(defaultContext);


export const CommandProvider = ( { children }) => {
  const [pattern, setPattern] = useState<Pattern>(Pattern.WAVE);
  const [scheme, setScheme] = useState<Scheme>(Scheme.VARYING);
  const [tactor, setTactor] = useState<Tactor | null>(Tactor.REAR);
  const [activationType, setActivationType] = useState<ActivationType>(ActivationType.MANUAL);
  const [attributes, setAttributes] = useState<AttributeList>(Attributes);
  const [commandText, setCommandText] = useState<Command | string>('');
  const [distanceUnits, setDistanceUnits] = useState<DistanceUnit>("metres");
  const [speedUnits, setSpeedUnits] = useState<SpeedUnit>("kmh");

  const [attributeUpdated, setAttributeUpdated] = useState(false);  // only updateCommand once
  const [updateCounter, setUpdateCounter] = useState<number>(0);    // triggers useEffect even if command not updated

  const commandTextRef = useRef(commandText);
  const tactorRef = useRef(tactor);

  useEffect(() => {
    tactorRef.current = tactor;
  }, [tactor]);


  // convert distance to metres and speed to ms-1 to calculate the following distance in seconds
  const calcFollowingDistance = (threat: Threat): Threat => {
    let distance = threat.distance;
    if (distanceUnits == "kilometers") distance = distance * 1000;
    else if (distanceUnits == "miles") distance = distance * 1609.34;
    let speed = threat.speed;
    if (speedUnits == "kmh") speed = speed / 3.6;
    else if (speedUnits == "mph") speed = speed / 2.237;

    const fd = distance/speed
    return { ...threat, ...{
      distanceUnits: distanceUnits,
      distanceString: `${Number(distance.toFixed(2))} m`,
      speedUnits: speedUnits,
      speedString: `${Number(speed.toFixed(2))} ms-1`, 
      followingDistance: Number(fd.toFixed(2))} }
  };



  const updateAttribute = (key: string, value: number): void => {
    setAttributes( prevAttributes => ({
      ...prevAttributes,
      [key]: {
        ...prevAttributes[key],
        currentValue: value
      }
    }))
  };

  function updateCommand (parameter: any): void {
    switch (getEnumType(parameter)) {
      case 'PATTERN':
        setPattern(parameter);
        break;
      case 'SCHEME':
        setScheme(parameter);
        break;
      case 'TACTOR':
        setTactor(parameter);
        break;
      case 'ACTIVATIONTYPE':
        setActivationType(parameter);
        break;
    };
  };

  /**
   * Change the number of repetitions every time the scheme or tactor is changed
   */
    const enforceRepetitions = () => {
      switch(scheme) {
        case Scheme.CUSTOM:
          break;
        case Scheme.CONSTANT:
          updateAttribute(attributes.repetitions.key, 1);
          break;
        case Scheme.VARYING:
          const n_tactor: number = tactor==Tactor.REAR ? 1 : tactor==Tactor.MID ? 2 : 3;
          updateAttribute(attributes.repetitions.key, n_tactor);
          break;
      }
      setAttributeUpdated(true);
    };
    useEffect(() => {
      if (scheme && tactor) {
        enforceRepetitions();
      }
    }, [scheme, tactor]);


  const updateCommandText = (text?: string) => {
    commandTextRef.current = text ? text : `${Pattern[pattern].toUpperCase()}:${tactor.toString().toUpperCase()},I${attributes.intensity.currentValue},D${attributes.stimulusDuration.currentValue},S${attributes.isi.currentValue},R${attributes.repetitions.currentValue},L${attributes.rhythmDelay.currentValue}`;
    setCommandText(text ? text : `${Pattern[pattern].toUpperCase()}:${tactor.toString().toUpperCase()},I${attributes.intensity.currentValue},D${attributes.stimulusDuration.currentValue},S${attributes.isi.currentValue},R${attributes.repetitions.currentValue},L${attributes.rhythmDelay.currentValue}`);
  };
  useEffect(() => {
    if (pattern && tactor && (activationType==ActivationType.MANUAL || attributeUpdated)) {
      updateCommandText();
      setAttributeUpdated(false);
      setUpdateCounter(prevCounter => prevCounter + 1);
    }
  }, [pattern, tactor, attributes, attributeUpdated]);



  const commandApi: VibrationCommandApi = {
    pattern,
    scheme,
    tactor,
    activationType,
    attributes,
    commandText,
    updateCounter,
    commandTextRef,
    tactorRef,
    updateAttribute,
    updateCommand,
    setTactor,
    updateCommandText,
    setAttributeUpdated,
    calcFollowingDistance,
    distanceUnits,
    speedUnits,
    setDistanceUnits,
    setSpeedUnits,
  };


  return (
    <CommandContext.Provider value={commandApi}>
      {children}
    </CommandContext.Provider>
  );
};


export const useVibrationCommand = () => {
  const command = useContext(CommandContext);
  if (!command) {
    throw new Error('command must be used within a CommandProvider');
  }
  return command;
};