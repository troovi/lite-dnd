import { useRef } from 'react'
import { useStyleManager } from './use-style-manager'
import { CursorPosition, Position, px } from './core'
import { getMargins, getRect } from './vectors'
import { bindEvents } from './bind'
import { createInputManager } from './input-manager'
import { ContextValue } from './DragContext'
import { getDragManager } from './drag-manager'
import { preventNextClick } from './prevent-click'

export interface DragProps {
  dragHandleProps: {
    'data-dnd-handle': string
    onTouchStart: (e: React.TouchEvent) => void
    onMouseDown: (e: React.MouseEvent) => void
  }
  draggableProps: {
    'data-dnd-draggable': string
    onTransitionEnd: () => void
    ref: React.RefObject<HTMLDivElement>
  }
}

export interface PlacementManager {
  shift({ x, y }: Partial<Position>, transition?: string): void
  initial(): void
}

interface Props {
  onMoveClassName?: string
  context: ContextValue
  listId: string
  index: number
  children: (props: DragProps) => JSX.Element
}

export const Draggable = ({ children, onMoveClassName, context, listId, index }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const styles = useStyleManager()
  const data = {
    onDragEnd: null as null | (() => void)
  }

  const placement: PlacementManager = {
    shift({ x, y }: Partial<Position>, transition: string = '') {
      if (ref.current) {
        ref.current.style.transform = `translate(${x ?? 0}px, ${y ?? 0}px)`
        ref.current.style.transition = transition
      }
    },
    initial() {
      if (ref.current) {
        if (ref.current.style.position) {
          if (onMoveClassName) {
            ref.current.classList.remove(onMoveClassName)
          }

          ref.current.style.position = ''
          ref.current.style.zIndex = ''
          ref.current.style.width = ''
          ref.current.style.boxSizing = ''
          ref.current.style.left = ''
          ref.current.style.top = ''
        }

        ref.current.style.transform = ''
        ref.current.style.transition = ''
      }
    }
  }

  // registry in context
  context.lists[listId].draggables.push({ ref, placement })

  // triggers on each render
  placement.initial()

  const startDragEvent = (e: CursorPosition) => {
    if (!ref.current) {
      return null
    }

    styles.handler.grabbing()
    styles.draggables.animate()

    const target = ref.current.getBoundingClientRect()
    const margins = getMargins(ref.current)

    const cursorOffset = {
      x: e.clientX - target.x,
      y: e.clientY - target.y
    }

    const startPosition = {
      x: target.x,
      y: target.y
    }

    if (onMoveClassName) {
      ref.current.classList.add(onMoveClassName)
    }

    // set first styles
    ref.current.style.position = 'fixed'
    ref.current.style.boxSizing = 'border-box'
    ref.current.style.zIndex = '5000'
    ref.current.style.left = px(startPosition.x)
    ref.current.style.top = px(startPosition.y)
    ref.current.style.width = px(target.width)

    context.isDragging = true

    const { onMouseMoving, onMouseUp, onDragEnd } = getDragManager(context, {
      subject: getRect(target),
      margins,
      listId,
      index
    })

    return {
      Move({ clientX, clientY }: CursorPosition) {
        if (ref.current) {
          const x = clientX - cursorOffset.x
          const y = clientY - cursorOffset.y

          ref.current.style.left = px(x)
          ref.current.style.top = px(y)

          onMouseMoving({ x, y })
        }
      },
      Up() {
        styles.handler.resting()

        if (ref.current) {
          const { x, y } = onMouseUp(startPosition)
          const { style } = ref.current

          data.onDragEnd = onDragEnd

          if (style.left !== px(x) || style.top !== px(y)) {
            style.left = px(x)
            style.top = px(y)
            style.transition = `all 0.38s cubic-bezier(0.2, 1, 0.1, 1) 0s`
          } else {
            onTransitionEnd()
          }
        }
      }
    }
  }

  const InputManager = createInputManager({
    preventEvent() {
      return context.isDragging
    },
    startMouseDragging(position) {
      const event = startDragEvent(position)

      if (event) {
        const { Move, Up } = event

        const onMouseMove = (e: MouseEvent) => {
          e.preventDefault()
          Move(e)
        }

        const onMouseUp = (e: MouseEvent) => {
          e.preventDefault()

          preventNextClick()
          unbind()
          Up()
        }

        const unbind = bindEvents((bind) => [
          bind({ eventName: 'mousemove', fn: onMouseMove }),
          bind({
            eventName: 'mouseup',
            fn: onMouseUp,
            options: {
              capture: true,
              passive: false
            }
          })
        ])
      }
    },
    startTouchDragging(position) {
      const event = startDragEvent(position)

      if (event) {
        const { Move, Up } = event

        const onMouseMove = (e: TouchEvent) => {
          // We need to prevent the default event in order to block native scrolling
          // Also because we are using it as part of a drag we prevent the default action
          // as a sign that we are using the event
          e.preventDefault()
          Move(e.touches[0])
        }

        const onMouseUp = () => {
          unbind()
          Up()
        }

        const unbind = bindEvents((bind) => [
          bind({
            eventName: 'touchmove',
            fn: onMouseMove,
            options: {
              capture: false,
              // Opting out of passive touchmove (default) so as to prevent scrolling while moving
              passive: false
            }
          }),
          bind({ eventName: 'touchend', fn: onMouseUp }),
          bind({ eventName: 'touchcancel', fn: onMouseUp }),
          bind({ eventName: 'resize', fn: onMouseUp }),
          bind({ eventName: 'keydown', fn: onMouseUp })
        ])
      }
    }
  })

  const onTransitionEnd = () => {
    if (data.onDragEnd) {
      styles.draggables.static()
      data.onDragEnd()

      data.onDragEnd = null
      context.isDragging = false
    }
  }

  return children({
    draggableProps: {
      ref,
      'data-dnd-draggable': '0',
      onTransitionEnd
    },
    dragHandleProps: {
      'data-dnd-handle': '0',
      ...InputManager
    }
  })
}
