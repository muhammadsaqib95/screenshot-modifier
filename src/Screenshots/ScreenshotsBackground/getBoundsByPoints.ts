import { Point, Bounds } from '../types'

export default function getBoundsByPoints (
  { x: x1, y: y1 }: Point,
  { x: x2, y: y2 }: Point,
  width: number,
  height: number
): Bounds {
  // exchange value
  if (x1 > x2) {
    [x1, x2] = [x2, x1]
  }

  if (y1 > y2) {
    [y1, y2] = [y2, y1]
  }

  // Limit graphics to elements
  if (x1 < 0) {
    x1 = 0
  }

  if (x2 > width) {
    x2 = width
  }

  if (y1 < 0) {
    y1 = 0
  }

  if (y2 > height) {
    y2 = height
  }

  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1
  }
}
