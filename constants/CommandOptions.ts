export enum Pattern {
  SINGLE = 'SINGLE',
  WALL = 'WALL',
  WAVE = 'WAVE'
};

export enum Scheme {
  CUSTOM = 'CUSTOM',
  CONSTANT = 'CONSTANT',
  VARYING = 'VARYING'
}

export enum Tactor {
  REAR = 'REAR',
  MID = 'MID',
  FRONT = 'FRONT'
}

export enum Distance {
  FAR = 'FAR',
  NEAR = 'NEAR',
  IMMINENT = 'IMMINENT'
};

export enum Scenario {
  PRACTICE = 'PRACTICE',
  SCENE1 = 'SCENE1',
  SCENE2 = 'SCENE2',
  SCENE3 = 'SCENE3',
  SCENE4 = 'SCENE4',
  SCENE5 = 'SCENE5',
  SCENE6 = 'SCENE6'
}

export enum ActivationType {
  MANUAL = 'MANUAL',
  SENSOR = 'SENSOR'
}

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

export interface AttributeList {
  [key: string]: Attribute
};

export type Command = `${keyof typeof Pattern}:${keyof typeof Tactor},I${number},D${number},S${number},R${number},L${number}`;

