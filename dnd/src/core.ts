export interface Position {
  x: number;
  y: number;
}
export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  x: number;
  y: number;
  center: Position;
}

export const px = (n: number) => `${n}px`


export interface CursorPosition {
  clientX: number
  clientY: number
}