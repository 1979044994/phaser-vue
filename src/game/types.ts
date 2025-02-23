// types.ts
export enum ChessType {
  START = 0,
  TURN = 1,
  REWARD = 2,
  QUESTION = 3,
  EVENT = 4,
  ACHIEVEMENT = 5,
  NORMAL = 6
}

export interface Cell {
  position: [number, number];
  type: ChessType;
  imgName: string;
  effect?: string;
}

export interface GameConfig {
  boardSize: number;
  specialCells: Cell[];
}
