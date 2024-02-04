import { useState, useEffect } from 'react';
import { getEnumType } from '../helpers/enumHelpers';
import { Pattern, Scheme, Tactor, ActivationType, AttributeList, Command } from "../../constants";

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
};


export function useVibrationCommand(): VibrationCommandApi {
  const [pattern, setPattern] = useState<Pattern>(Pattern.SINGLE);
  const [scheme, setScheme] = useState<Scheme>(Scheme.CUSTOM);
  const [tactor, setTactor] = useState<Tactor | null>(Tactor.REAR);
  const [activationType, setActivationType] = useState<ActivationType>(ActivationType.MANUAL);
  const [attributes, setAttributes] = useState<AttributeList>(Attributes);
  const [commandText, setCommandText] = useState<Command | string>('');

  const [attributeUpdated, setAttributeUpdated] = useState(false);  // only updateCommand once
  const [updateCounter, setUpdateCounter] = useState<number>(0);    // triggers useEffect even if command not updated


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
    setCommandText(text ? text : `${Pattern[pattern].toUpperCase()}:${tactor.toString().toUpperCase()},I${attributes.intensity.currentValue},D${attributes.stimulusDuration.currentValue},S${attributes.isi.currentValue},R${attributes.repetitions.currentValue},L${attributes.rhythmDelay.currentValue}`);
  };
  useEffect(() => {
    if (pattern && tactor && (activationType==ActivationType.MANUAL || attributeUpdated)) {
      updateCommandText();
      setAttributeUpdated(false);
      setUpdateCounter(prevCounter => prevCounter + 1);
    }
  }, [pattern, tactor, attributes, attributeUpdated]);


  return {
    pattern,
    scheme,
    tactor,
    activationType,
    attributes,
    commandText,
    updateCounter,
    updateAttribute,
    updateCommand,
    setTactor,
    updateCommandText
  }
}