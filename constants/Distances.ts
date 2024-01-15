export enum Distance {
  FAR,
  NEAR,
  IMMINENT
};
export type DistanceStrings = keyof typeof Distance;