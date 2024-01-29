import { useState, useEffect } from 'react';
import { Pattern, Scheme, Tactor, Scenario, ActivationType } from "../constants";

interface Attribute {
  key: string;
  name: string;
  description: string;
  units?: string;
  defaultValue: number;
  minValue: number;
  maxValue: number;
  step: number;
  currentValue: number;
};
interface AttributeList {
  [key: string]: Attribute
};
const Attributes: AttributeList = {
  intensity: { key: "intensity", name: "Intensity", description: "The strength of a vibration.", 
    defaultValue: 255, minValue: 0, maxValue: 255, step: 5, currentValue: 255},
  stimulusDuration: { key: "stimulusDuration", name: "Stimulus Duration", description: "The length of a single stimuli.", units: "ms", 
    defaultValue: 1000, minValue: 0, maxValue: 2_000, step: 100, currentValue: 500},
  isi: { key: "isi", name: "Inter-Stimulus Interval", description: "The time between consecutive stimuli in a rhythm.", units: "ms", 
    defaultValue: 500, minValue: 0, maxValue: 1_000, step: 50, currentValue: 250},
  repetitions: { key: "repetitions", name: "Rhythm Duration / Repetitions", description: "The number of times a rhythm is repeated consecutively.", 
    defaultValue: 3, minValue: 0, maxValue: 10, step: 1, currentValue: 1},
  rhythmDelay: { key: "rhythmDelay", name: "Inter-Rhythm Interval / Rhythm Delay", description: "The time between consecutive rhythms in a cue.", units: "ms", 
    defaultValue: 1000, minValue: 0, maxValue: 2_000, step: 100, currentValue: 1_000},
};



interface VibrationCommandApi {
  pattern: Pattern;
  scheme: Scheme;
  tactor: Tactor;
  scenario: Scenario;
  activationType: ActivationType;
  attributes: AttributeList;
  commandText: string;
  updatePattern: (pattern: Pattern) => void;
  updateScheme: (scheme: Scheme) => void;
  updateTactor: (tactor: Tactor) => void;
  updateScenario: (scenario: Scenario) => void;
  updateActivationType: (type: ActivationType) => void;
  updateAttribute: (key: string, value: number) => void;
  updateCommandText: (text?: string) => void;
};


export function useVibrationCommand(): VibrationCommandApi {
  const [pattern, setPattern] = useState<Pattern>(Pattern.SINGLE);
  const [scheme, setScheme] = useState<Scheme>(Scheme.CUSTOM);
  const [tactor, setTactor] = useState<Tactor>(Tactor.REAR);
  const [scenario, setScenario] = useState<Scenario>(Scenario.REAL);
  const [activationType, setActivationType] = useState<ActivationType>(ActivationType.MANUAL);
  const [attributes, setAttributes] = useState<AttributeList>(Attributes);
  const [commandText, setCommandText] = useState<string>('');


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
        const n_tactor: number = tactor;
        updateAttribute(attributes.repetitions.key, n_tactor+1);
        break;
    }
  };
  useEffect(() => {
    enforceRepetitions();
  }, [scheme, tactor]);


  const updatePattern = (pattern: Pattern): void => {
    setPattern(Pattern[pattern.toString()]);
  };

  const updateScheme = (scheme: Scheme): void => {
    setScheme(Scheme[scheme.toString()]);
  };

  const updateTactor = (tactor: Tactor): void => {
    setTactor(Tactor[tactor.toString()]);
  };
  
  const updateScenario = (scene: Scenario): void => {
    setScenario(Scenario[scene.toString()]);
  };

  const updateActivationType = (type: ActivationType): void => {
    setActivationType(type);
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

  const updateCommandText = (text?: string) => {
    setCommandText(text ? text : `${Pattern[pattern].toUpperCase()}:${Tactor[tactor].toUpperCase()},I${attributes.intensity.currentValue},D${attributes.stimulusDuration.currentValue},S${attributes.isi.currentValue},R${attributes.repetitions.currentValue},L${attributes.rhythmDelay.currentValue}`);
  };
  useEffect(() => {
    updateCommandText();
  }, [pattern, tactor, attributes]);

  return {
    pattern,
    scheme,
    tactor,
    scenario,
    activationType,
    attributes,
    commandText,
    updatePattern,
    updateScheme,
    updateTactor,
    updateScenario,
    updateActivationType,
    updateAttribute,
    updateCommandText
  }
}