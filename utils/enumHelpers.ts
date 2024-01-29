export function enumToArray<T>(enumObject: T): Array<keyof T> {
  return Object.keys(enumObject).filter((key) => isNaN(Number(key))) as Array<keyof T>;
};