import { Pattern, Scheme, Tactor, Scenario, ActivationType } from '../../constants';

export function enumToArray<T>(enumObject: T): Array<keyof T> {
  return Object.keys(enumObject).filter((key) => isNaN(Number(key))) as Array<keyof T>;
};

export const getEnumType = (value: any): string => {
  if (Object.values(Pattern).includes(value)) {
    return 'PATTERN';
  } else if (Object.values(Scheme).includes(value)) {
    return 'SCHEME';
  } else if (Object.values(Tactor).includes(value)) {
    return 'TACTOR';
  } else if (Object.values(Scenario).includes(value)) {
    return 'SCENARIO';
  } else if (Object.values(ActivationType).includes(value)) {
    return 'ACTIVATIONTYPE';
  }
};