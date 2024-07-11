import { Rect } from '../core'
import { Axis } from './axis'
import { config } from '../config'

export interface DistanceThresholds {
  startScrollingFrom: number
  maxScrollValueAt: number
}

// converts the percentages in the config into actual pixel values
export const getDistanceThresholds = (container: Rect, axis: Axis): DistanceThresholds => {
  return {
    startScrollingFrom: container[axis.size] * config.startFromPercentage,
    maxScrollValueAt: container[axis.size] * config.maxScrollAtPercentage
  }
}
