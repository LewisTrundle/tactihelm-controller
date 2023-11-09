import { ThreatLevels } from "../constants";

export class Threat {
  id: number;
  distance: number;
  speed: number;
  level: ThreatLevels

  constructor(id: number, distance: number, speed: number) {
    this.id = id;
    this.distance = distance;
    this.speed = speed;
  }
};