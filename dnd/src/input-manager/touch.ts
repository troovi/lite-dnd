import { CursorPosition } from '../core'
import { bindEvents } from '../bind'

interface Args {
  event: React.TouchEvent
  startTouchDragging: (position: CursorPosition) => void
}

const timeForLongPress = 120

export const TouchHandler = ({ event, startTouchDragging }: Args) => {
  const startDragging = () => {
    unbind()
    startTouchDragging(event.touches[0])
  }

  const longPressTimerId = setTimeout(startDragging, timeForLongPress)

  const cancel = () => {
    unbind()
    clearTimeout(longPressTimerId)
  }

  const unbind = bindEvents((bind) => [
    bind({ eventName: 'touchmove', fn: () => cancel() }),
    bind({ eventName: 'touchend', fn: () => cancel() }),
    bind({ eventName: 'touchcancel', fn: () => cancel() }),
    // some devices fire resize if the orientation changes
    bind({ eventName: 'resize', fn: () => cancel() }),
    // Long press can bring up a context menu
    // need to opt out of this behavior
    bind({ eventName: 'contextmenu', fn: (e) => e.preventDefault() }),
    // On some devices it is possible to have a touch interface with a keyboard.
    // On any keyboard event we cancel a touch drag
    bind({ eventName: 'keydown', fn: () => cancel() })
  ])
}
