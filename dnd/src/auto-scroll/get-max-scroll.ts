import { Position } from '../core'
import { subtract } from '../vectors'

type Args = {
  scrollHeight: number
  scrollWidth: number
  height: number
  width: number
}

const getMaxScroll = ({ scrollHeight, scrollWidth, height, width }: Args): Position => {
  const maxScroll: Position = subtract(
    // full size
    { x: scrollWidth, y: scrollHeight },
    // viewport size
    { x: width, y: height }
  )

  const adjustedMaxScroll: Position = {
    x: Math.max(0, maxScroll.x),
    y: Math.max(0, maxScroll.y)
  }

  return adjustedMaxScroll
}

export { getMaxScroll }
