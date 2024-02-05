import { useState } from 'react';
import { Tactor } from "../../constants";

interface PlayScenarioProps {
  bcConnectedDevice: any;
  updateCommand: any;
  setTactor: any;
  setAttributeUpdated: any;
};

interface ScenarioApi {
  scenario: number;
  playingScenario: boolean;
  scenarioActive: boolean;
  answer: string;
  updateScenario: (s: number) => void;
  playScenario: (playScenarioProps: PlayScenarioProps) => Promise<void>;
  addAnswer: (guess: string) => void;
  updateAnswer: (guess: string) => void;
  submitAnswer: () => void;
};

const scenarios = {
  1: ["REAR", "MID", "FRONT", "MID", "REAR", "MID", "FRONT"],
  2: ["FRONT", "MID", "FRONT", "REAR", "REAR", "MID", "FRONT", "MID", "FRONT", "REAR", "MID", "REAR"],
  3: ["MID", "MID", "REAR", "REAR", "FRONT", "MID", "FRONT", "REAR", "FRONT", "REAR", "FRONT", "MID"],

  4: ["FRONT", "MID", "REAR", "MID", "FRONT", "MID", "REAR"],
  5: ["REAR", "MID", "REAR", "FRONT", "REAR", "MID", "REAR", "MID", "FRONT", "FRONT", "MID", "FRONT"],
  6: ["FRONT", "MID", "REAR", "MID", "REAR", "FRONT", "REAR", "MID", "FRONT", "REAR", "MID", "FRONT"],
  
  7: ["MID", "FRONT", "MID", "REAR", "MID", "FRONT", "MID"],
  8: ["MID", "MID", "REAR", "FRONT", "FRONT", "MID", "REAR", "REAR", "FRONT", "MID", "REAR", "FRONT"],
  9: ["REAR", "REAR", "MID", "FRONT", "MID", "FRONT", "REAR", "MID", "FRONT", "MID", "REAR", "FRONT"],
  
  10: ["REAR", "MID", "FRONT", "MID", "FRONT", "MID", "REAR"],
  11: ["MID", "REAR", "FRONT", "MID", "REAR", "FRONT", "REAR", "MID", "FRONT", "MID", "FRONT", "REAR"],
  12: ["FRONT", "REAR", "MID", "FRONT", "MID", "FRONT", "MID", "REAR", "FRONT", "MID", "REAR", "REAR"],

  13: ["FRONT", "MID", "FRONT", "MID", "REAR", "MID", "FRONT"],
  14: ["REAR", "FRONT", "FRONT", "REAR", "MID", "REAR", "MID", "FRONT", "FRONT", "MID", "MID", "REAR"],
  15: ["FRONT", "REAR", "MID", "FRONT", "REAR", "FRONT", "MID", "FRONT", "MID", "REAR", "MID", "REAR"],
  
  16: ["MID", "REAR", "MID", "FRONT", "MID", "FRONT", "MID"],
  17: ["FRONT", "REAR", "MID","REAR", "MID", "FRONT", "MID", "REAR", "FRONT", "MID", "FRONT", "REAR"],
  18: ["REAR", "MID", "MID", "FRONT", "REAR", "FRONT", "MID", "REAR", "FRONT", "REAR", "MID", "FRONT"],
};


export function useScenario(): ScenarioApi {
  const [scenario, setScenario] = useState<number>(0);
  const [playingScenario, setPlayingScenario] = useState<boolean>(false);
  const [scenarioActive, setScenarioActive] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>('');


  const delay = async (ms): Promise<void> => {
    return new Promise((resolve) => 
      setTimeout(resolve, ms));
  };

  const addAnswer = (guess: string): void => {
    setAnswer(answer + '\n' + guess);
  };

  const updateAnswer = (guess: string): void => {
    setAnswer(guess);
  };

  const submitAnswer = (): void => {
    console.log(answer);
    setPlayingScenario(false);
    setAnswer('');
  };

  const updateScenario = (s: number): void => {
    setScenario(s);
  };


  const playScenario = async ({ bcConnectedDevice, updateCommand, setTactor, setAttributeUpdated }: PlayScenarioProps): Promise<void> => {
    if (!bcConnectedDevice) return;
    console.log("\nNow playing scenario " + scenario);

    const fakeVibrate = async (delayAmount: number, tactor: Tactor | string): Promise<void> => {
      await delay(delayAmount);
      await updateCommand(tactor);
      setAttributeUpdated(true);
    };

    const playScene = async () => {
      const scene = scenarios[scenario];
      await setTactor(null);
      for (let i = 0; i < scene.length; i++) {
        await fakeVibrate(5000, scene[i]);
      }
    };

    setPlayingScenario(true);
    if (scenario==0) return;
    setScenarioActive(true);
    await playScene();

    await delay(2000);
    setScenarioActive(false);
    console.log("\nFinished playing scenario " + scenario);
  };

  return {
    scenario,
    playingScenario,
    scenarioActive,
    answer,
    updateScenario,
    playScenario,
    addAnswer,
    updateAnswer,
    submitAnswer
  }
}