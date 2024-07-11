import { Position, Rect, Spacing } from './core'

export const origin: Position = { x: 0, y: 0 }

export const add = (point1: Position, point2: Position): Position => ({
  x: point1.x + point2.x,
  y: point1.y + point2.y
})

export const subtract = (point1: Position, point2: Position): Position => ({
  x: point1.x - point2.x,
  y: point1.y - point2.y
})

export const isEqual = (point1: Position, point2: Position): boolean =>
  point1.x === point2.x && point1.y === point2.y

export const negate = (point: Position): Position => ({
  // if the value is already 0, do not return -0
  x: point.x !== 0 ? -point.x : 0,
  y: point.y !== 0 ? -point.y : 0
})

// Returns the distance between two points
// https://www.mathsisfun.com/algebra/distance-2-points.html
export const distance = (point1: Position, point2: Position): number =>
  Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))

// When given a list of points, it finds the smallest distance to any point
export const closest = (target: Position, points: Position[]): number =>
  Math.min(...points.map((point: Position) => distance(target, point)))

// used to apply any function to both values of a point
// eg: const floor = apply(Math.floor)(point);
export const apply = (fn: (value: number) => number) => {
  return (point: Position): Position => ({
    x: fn(point.x),
    y: fn(point.y)
  })
}

interface Params {
  width: number
  height: number
  x: number
  y: number
}

export const getRect = ({ x, y, width, height }: Params): Rect => {
  return {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    center: {
      x: x + width / 2,
      y: y + height / 2
    }
  }
}

const parse = (raw: string) => {
  return Number(raw.slice(0, -2))
}

export const getMargins = (el: Element): Spacing => {
  const styles: CSSStyleDeclaration = window.getComputedStyle(el)

  return {
    top: parse(styles.marginTop),
    right: parse(styles.marginRight),
    bottom: parse(styles.marginBottom),
    left: parse(styles.marginLeft)
  }
}

export const spacing = ({ top, left, bottom, right }: Spacing) => {
  return `${top}px ${right}px ${bottom}px ${left}px`
}

export const spacingY = ({ top, bottom }: Spacing) => {
  return top + bottom
}

export const spacingX = ({ left, right }: Spacing) => {
  return left + right
}
