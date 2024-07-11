import { getDistanceThresholds } from './get-distance-thresholds'
import { Axis } from './axis'
import { Rect, Spacing } from '../core'
import { getValueFromDistance } from './get-value-from-distance'

interface GetOnAxisArgs {
  container: Rect
  distanceToEdges: Spacing
  axis: Axis
}

export const getScrollOnAxis = ({ container, distanceToEdges, axis }: GetOnAxisArgs): number => {
  const thresholds = getDistanceThresholds(container, axis)

  if (distanceToEdges[axis.end] < distanceToEdges[axis.start]) {
    return getValueFromDistance(distanceToEdges[axis.end], thresholds)
  }

  return -1 * getValueFromDistance(distanceToEdges[axis.start], thresholds)
}
