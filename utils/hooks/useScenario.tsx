import { useState } from 'react';
import { Tactor } from "../../constants";

interface PlayScenarioProps {
  bcConnectedDevice: any;
  updateCommand: any;
  setTactor: any;
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
  1: [[3000, "REAR"], [5000, "MID"], [7000, "FRONT"], [5000, "MID"], [4000, "REAR"], [6000, "MID"], [7000, "FRONT"]],
  2: [[3000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "REAR"]],
  3: [[3000, "MID"], [6000, "MID"], [6000, "REAR"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"], [6000, "FRONT"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"]],

  4: [[3000, "FRONT"], [5000, "MID"], [5000, "REAR"], [6000, "MID"], [6000, "FRONT"], [8000, "MID"], [7000, "REAR"]],
  5: [[3000, "REAR"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"]],
  6: [[3000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"]],
  
  7: [[3000, "MID"], [5000, "FRONT"], [5000, "MID"], [6000, "REAR"], [7000, "MID"], [7000, "FRONT"], [8000, "MID"]],
  8: [[3000, "MID"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"]],
  9: [[3000, "REAR"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"]],
  
  10: [[3000, "REAR"], [4000, "MID"], [6000, "FRONT"], [7000, "MID"], [8000, "FRONT"], [4000, "MID"], [4000, "REAR"]],
  11: [[3000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"]],
  12: [[3000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "REAR"]],

  13: [[3000, "FRONT"], [5000, "MID"], [5000, "FRONT"], [6000, "MID"], [6000, "REAR"], [8000, "MID"], [7000, "FRONT"]],
  14: [[3000, "REAR"], [6000, "FRONT"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "FRONT"], [6000, "MID"], [6000, "MID"], [6000, "REAR"]],
  15: [[3000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "MID"], [6000, "REAR"]],
  
  16: [[3000, "MID"], [3000, "REAR"], [4000, "MID"], [6000, "FRONT"], [5000, "MID"], [6000, "FRONT"], [7000, "MID"]],
  17: [[3000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"]],
  18: [[3000, "REAR"], [6000, "MID"], [6000, "MID"], [6000, "FRONT"], [6000, "REAR"], [6000, "FRONT"], [6000, "MID"], [6000, "REAR"], [6000, "FRONT"], [6000, "REAR"], [6000, "MID"], [6000, "FRONT"]],
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


  const playScenario = async ({ bcConnectedDevice, updateCommand, setTactor }: PlayScenarioProps): Promise<void> => {
    if (!bcConnectedDevice) return;
    console.log("\nNow playing scenario " + scenario);

    const fakeVibrate = async (delayAmount: number, tactor: Tactor | string): Promise<void> => {
      await delay(delayAmount);
      await updateCommand(tactor);
    };

    const playScene = async () => {
      const scene = scenarios[scenario];
      await setTactor(null);
      for (let i = 0; i < 10; i++) {
        const delay: number = scene[i][0];
        const tactor: Tactor = scene[i][1];
        await fakeVibrate(delay, tactor);
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