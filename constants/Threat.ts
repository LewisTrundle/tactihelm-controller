import { DistanceUnit, SpeedUnit } from "./Units";

export interface Threat {
  id: number;
  distance: number;
  speed: number;
  followingDistance?: number;
  distanceString?: string;
  speedString?: string;
  distanceUnits?: DistanceUnit;
  speedUnits?: SpeedUnit;
};