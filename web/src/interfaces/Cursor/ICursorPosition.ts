import { CursorModeType } from './CursorModeType';

export interface ICursorPosition {
  x: number;
  y: number;
}

export interface ICursorPositionInfo extends ICursorPosition {
  name: string;
  mode: CursorModeType;
}
