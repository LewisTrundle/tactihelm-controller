import { useState } from 'react';
import { Tactor, Scenario } from "../../constants";

interface PlayScenarioProps {
  scenario: Scenario;
  bcConnectedDevice: any;
  updateCommand: any;
  setTactor: any;
};

interface ScenarioApi {
  playingScenario: boolean;
  scenarioActive: boolean;
  answer: string;
  playScenario: (playScenarioProps: PlayScenarioProps) => Promise<void>;
  addAnswer: (guess: string) => void;
  updateAnswer: (guess: string) => void;
  submitAnswer: () => void;
};


export function useScenario(): ScenarioApi {
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


  const playScenario = async ({ scenario, bcConnectedDevice, updateCommand, setTactor }: PlayScenarioProps): Promise<void> => {
    if (!bcConnectedDevice) return;
    console.log("\nNow playing scenario " + scenario);

    const fakeVibrate = async (delayAmount: number, tactor: Tactor | string): Promise<void> => {
      await delay(delayAmount);
      await updateCommand(tactor);
    };

    // FAR, NEAR, IMMINENT, NEAR, IMMINENT, NEAR, FAR
    // medium pace approach, quickly transitions between close and imminent
    const playScene1 = async (): Promise<void> => {
      await setTactor(null);
      await fakeVibrate(3000, Tactor.REAR);
      await fakeVibrate(6000, Tactor.MID);
      await fakeVibrate(2000, Tactor.FRONT);
      await fakeVibrate(2000, Tactor.MID);
      await fakeVibrate(2000, Tactor.FRONT);
      await fakeVibrate(3000, Tactor.MID);
      await fakeVibrate(8000, Tactor.REAR);
    };

    // NEAR, IMMINENT, NEAR, FAR, NEAR, IMMINENT, NEAR 
    // first detected at mid, slowly approaches and goes away, quickly approaches again
    const playScene2 = async () => {
      await setTactor(null);
      await fakeVibrate(3000, Tactor.MID);
      await fakeVibrate(8000, Tactor.FRONT);
      await fakeVibrate(8000, Tactor.MID);
      await fakeVibrate(8000, Tactor.REAR);
      await fakeVibrate(5000, Tactor.MID);
      await fakeVibrate(2000, Tactor.FRONT);
      await fakeVibrate(2000, Tactor.MID);
    };

    // FAR, NEAR, IMMINENT, NEAR, FAR, NEAR 
    const playScene3 = async () => {
      await setTactor(null);
      await fakeVibrate(3000, Tactor.REAR);
      await fakeVibrate(7000, Tactor.MID);
      await fakeVibrate(7000, Tactor.FRONT);
      await fakeVibrate(10000, Tactor.MID);
      await fakeVibrate(7000, Tactor.REAR);
      await fakeVibrate(5000, Tactor.MID);
    };

    // FAR, NEAR, IMMINENT, NEAR, IMMINENT, NEAR, FAR 
    const playScene4 = async () => {
      await setTactor(null);
      await fakeVibrate(3000, Tactor.REAR);
      await fakeVibrate(2000, Tactor.MID);
      await fakeVibrate(2000, Tactor.FRONT);
      await fakeVibrate(5000, Tactor.MID);
      await fakeVibrate(5000, Tactor.FRONT);
      await fakeVibrate(2000, Tactor.MID);
      await fakeVibrate(2000, Tactor.REAR);
    };

    // NEAR, IMMINENT, NEAR, FAR, NEAR, IMMINENT, NEAR 
    // first detected at mid, slowly approaches and goes away, quickly approaches again
    const playScene5 = async () => {
      await setTactor(null);
      await fakeVibrate(3000, Tactor.MID);
      await fakeVibrate(8000, Tactor.FRONT);
      await fakeVibrate(8000, Tactor.MID);
      await fakeVibrate(8000, Tactor.REAR);
      await fakeVibrate(5000, Tactor.MID);
      await fakeVibrate(2000, Tactor.FRONT);
      await fakeVibrate(2000, Tactor.MID);
    };

    // NEAR, IMMINENT, NEAR, FAR, NEAR, IMMINENT, NEAR 
    // first detected at mid, slowly approaches and goes away, quickly approaches again
    const playScene6 = async () => {
      await setTactor(null);
      await fakeVibrate(3000, Tactor.MID);
      await fakeVibrate(8000, Tactor.FRONT);
      await fakeVibrate(8000, Tactor.MID);
      await fakeVibrate(8000, Tactor.REAR);
      await fakeVibrate(5000, Tactor.MID);
      await fakeVibrate(2000, Tactor.FRONT);
      await fakeVibrate(2000, Tactor.MID);
    };

    setPlayingScenario(true);
    switch (scenario) {
      case Scenario.PRACTICE:
        return;
      case Scenario.SCENE1:
        setScenarioActive(true);
        await playScene1();
        break;
      case Scenario.SCENE2:
        setScenarioActive(true);
        await playScene2();
        break;
      case Scenario.SCENE3:
        setScenarioActive(true);
        await playScene3();
        break;
      case Scenario.SCENE4:
        setScenarioActive(true);
        await playScene4();
        break;
      case Scenario.SCENE5:
        setScenarioActive(true);
        await playScene5();
        break;
      case Scenario.SCENE6:
        setScenarioActive(true);
        await playScene6();
        break;
    }
    await delay(2000);
    setScenarioActive(false);
    console.log("\nFinished playing scenario " + scenario);
  };

  return {
    playingScenario,
    scenarioActive,
    answer,
    playScenario,
    addAnswer,
    updateAnswer,
    submitAnswer
  }
}