import { Position, Rect } from '../core'
import { getScroll } from './get-scroll'
import { canScrollDroppable } from './can-scroll'

interface Args {
  container: Rect
  center: Position
  scroll: {
    max: Position
    current: Position
  }
}

export const getScrollChange = (props: Args) => {
  const change = getScroll(props)

  return change && canScrollDroppable(props.scroll, change) ? change : null
}
