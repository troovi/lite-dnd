import { CursorPosition } from '../core'
import { MouseHandler } from './mouse'
import { TouchHandler } from './touch'

interface Args {
  preventEvent: () => boolean
  startTouchDragging: (position: CursorPosition) => void
  startMouseDragging: (position: CursorPosition) => void
}

export const createInputManager = ({ preventEvent, startMouseDragging, startTouchDragging }: Args) => ({
  // mouse
  onMouseDown(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (!preventEvent()) {
      MouseHandler({ event, startMouseDragging })
    }
  },
  // touch
  onTouchStart(event: React.TouchEvent) {
    if (!preventEvent()) {
      TouchHandler({ event, startTouchDragging })
    }
  }
})
