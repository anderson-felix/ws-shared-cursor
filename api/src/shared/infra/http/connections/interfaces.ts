export const cursorMovementMode = <const>['pencil', 'cursor'];

export type CursorMovementMode = typeof cursorMovementMode[number];

export interface CursorPositionInfo {
  x: number;
  y: number;
  username: string;
  mode: CursorMovementMode;
}
