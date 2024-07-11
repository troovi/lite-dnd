import { apply, isEqual, origin } from '../vectors'
import { horizontal, vertical } from './axis'
import { Position, Rect, Spacing } from '../core'
import { getScrollOnAxis } from './get-scroll-on-axis'

interface Args {
  container: Rect
  center: Position
}

// will replace -0 and replace with +0
const clean = apply((value: number) => (value === 0 ? 0 : value))

const getScroll = ({ container, center }: Args) => {
  // get distance to each edge
  const distanceToEdges: Spacing = {
    top: center.y - container.top,
    right: container.right - center.x,
    bottom: container.bottom - center.y,
    left: center.x - container.left
  }

  // 1. Figure out which x,y values are the best target
  // 2. Can the container scroll in that direction at all?
  // If no for both directions, then return null
  // 3. Is the center close enough to a edge to start a drag?
  // 4. Based on the distance, calculate the speed at which a scroll should occur
  // The lower distance value the faster the scroll should be.
  // Maximum speed value should be hit before the distance is 0
  // Negative values to not continue to increase the speed

  const y = getScrollOnAxis({
    container,
    distanceToEdges,
    axis: vertical
  })

  const x = getScrollOnAxis({
    container,
    distanceToEdges,
    axis: horizontal
  })

  const required: Position = clean({ x, y })

  // nothing required
  if (isEqual(required, origin)) {
    return null
  }

  return required
}

export { getScroll }
