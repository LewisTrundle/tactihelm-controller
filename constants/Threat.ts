import { DistanceUnit, SpeedUnit } from "./Units";
import { Distance, Tactor } from "./CommandOptions";

export interface Threat {
  id: number;
  distance: number;
  speed: number;
  followingDistance?: number;
  distanceMeters?: string;
  distanceMiles?: string;
  distanceKilometers?: string;
  speedMS?: string;
  speedMPH?: string;
  speedKMH?: string;
  distanceUnits?: DistanceUnit;
  speedUnits?: SpeedUnit;
  distanceCategory?: Distance;
  tactor?: Tactor;
  vibrate?: boolean;
};