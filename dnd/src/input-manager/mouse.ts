import { bindEvents } from '../bind'
import { CursorPosition, Position } from '../core'

interface Args {
  event: React.MouseEvent
  startMouseDragging: (position: CursorPosition) => void
}

export const MouseHandler = ({ event, startMouseDragging }: Args) => {
  const original = {
    x: event.clientX,
    y: event.clientY
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isThresholdExceeded(original, { x: e.clientX, y: e.clientY })) {
      unbind()
      e.preventDefault()
      startMouseDragging(e)
    }
  }

  const handleMouseUp = (ev: MouseEvent) => {
    ev.stopPropagation()
    unbind()
  }

  const unbind = bindEvents((bind) => [
    bind({ eventName: 'mousemove', fn: handleMouseMove }),
    bind({ eventName: 'mouseup', fn: handleMouseUp })
  ])
}

const threshold = 4

const isThresholdExceeded = (original: Position, current: Position) => {
  return Math.abs(current.x - original.x) >= threshold || Math.abs(current.y - original.y) >= threshold
}
