export enum Command {
  SINGLE,
  WALL,
  WAVE
};
export type CommandStrings = keyof typeof Command;

const commands: CommandStrings[] = Object.keys(Command).filter((key) => isNaN(Number(key))) as CommandStrings[];