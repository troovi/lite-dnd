import { Position, Rect, Spacing } from '../core'
import { add, getRect, spacingY, origin, subtract } from '../vectors'
import { createPlaceholderAgent } from '../Placeholder'
import { PlacementManager } from '../Draggable'
import { AutoScroll } from '../auto-scroll'

interface DraggableItem {
  label: string
  placement: PlacementManager
  margins: Spacing
  bottom: number
  center: number
  bias: number
}

export type ListsData = {
  [listId: string]: {
    droppable: Rect
    draggables: DraggableItem[]
  }
}

export interface DropResult {
  source: {
    listId: string
    index: number
  }
  destination: {
    listId: string
    index: number
  }
}

export interface Source {
  listId: string
  index: number
  subject: Rect
  margins: Spacing
}

interface Args {
  source: Source
  lists: ListsData
  scrollable: HTMLElement | null
  onDragMoved: (props: DropResult) => void
  placeholder: ReturnType<typeof createPlaceholderAgent>
}

const createDragManager = ({ scrollable, lists, source, placeholder, onDragMoved }: Args) => {
  // rename
  const YBias = source.subject.height + spacingY(source.margins)

  const destination = {
    listId: source.listId as null | string,
    index: source.index
  }

  const isSubjectInScrollable = ({ right, bottom, left, top }: Rect) => {
    if (destination.listId) {
      return true
    }

    // if center of the subject in scrollable area
    const { center } = source.subject

    return top <= center.y && center.y <= bottom && left <= center.x && center.x <= right
  }

  const autoScroll = (() => {
    if (scrollable) {
      return new AutoScroll(scrollable, {
        center: source.subject.center,
        isSubjectInScrollable,
        onScroll: () => {
          onSubjectMoving()
        }
      })
    }
  })()

  let outedItem: DraggableItem | null = null

  // move
  const moveDraggables = (transition: string = '') => {
    if (!destination.listId) {
      return
    }

    lists[destination.listId].draggables.forEach((draggable, i) => {
      if (i > destination.index) {
        draggable.placement.shift({ y: YBias }, transition)
        draggable.bias = YBias
      } else {
        if (i !== destination.index) {
          draggable.placement.initial()
          draggable.bias = 0
        }
      }
    })
  }

  const onSubjectOut = () => {
    const fromListId = destination.listId

    if (fromListId) {
      const { draggables } = lists[fromListId]

      const x1 = destination.index

      const [dragging] = draggables.splice(x1, 1)

      outedItem = dragging

      console.log('OUT', fromListId, outedItem.label)

      destination.index = -1
      destination.listId = null

      // ui-changes
      if (fromListId !== source.listId) {
        placeholder.remove(fromListId)
      }

      draggables.forEach((draggable) => {
        draggable.placement.initial()
        draggable.bias = 0
      })
    }
  }

  const onSubjectMoving = () => {
    const draggable = (() => {
      if (autoScroll) {
        return getRect({
          ...source.subject,
          ...add(source.subject, autoScroll.getOffset())
        })
      }

      return source.subject
    })()

    const isInDroppable = (droppable: Rect, bottomValue: number = 0) => {
      // если присутствует scrollable-container
      // необходмо проверить, находится ли видимое положение subject в области scrollable
      if (autoScroll) {
        if (source.subject.top > autoScroll.scrollable.bottom) {
          return false
        }

        if (source.subject.bottom < autoScroll.scrollable.top) {
          return false
        }
      }

      // положение draggable вычисляется относительно реальной позиции на странице (с поправкой на скролл)
      // значения границ droppable равняются его реальным границам (без ограничений границами scrollable)

      const Center = droppable.center.x
      const LimitTop = droppable.top
      const LimitBottom = droppable.bottom + bottomValue

      return (
        draggable.bottom >= LimitTop &&
        draggable.top <= LimitBottom &&
        draggable.left < Center &&
        draggable.right > Center
      )
    }

    const isOutDroppable = (listId: string) => {
      return !isInDroppable(lists[listId].droppable, listId !== source.listId ? YBias : 0)
    }

    if (destination.listId) {
      if (isOutDroppable(destination.listId)) {
        onSubjectOut()
      }
    } else {
      for (const listId in lists) {
        if (isInDroppable(lists[listId].droppable)) {
          destination.listId = listId
          placeholder.add(listId)

          break
        }
      }
    }

    if (destination.listId) {
      const { draggables } = lists[destination.listId]

      if (outedItem) {
        if (draggables.length === 0) {
          destination.index = 0
        } else {
          for (let i = 0; i < draggables.length - 1; i++) {
            if (draggable.y >= draggables[i].center && draggable.y < draggables[i + 1].center) {
              destination.index = i + 1
              break
            }
          }

          if (destination.index === -1) {
            if (draggable.y < draggables[0].center) {
              destination.index = 0
            }

            if (draggable.y >= draggables[draggables.length - 1].center) {
              destination.index = draggables.length
            }
          }
        }

        draggables.splice(destination.index, 0, outedItem)
        outedItem = null

        moveDraggables()
        return
      }

      const closestTop = draggables[destination.index - 1]
      const closestBottom = draggables[destination.index + 1]

      const moveToDirection = (dir: 1 | -1) => {
        const { draggables } = lists[destination.listId!]
        const [dragging] = draggables.splice(destination.index, 1)

        destination.index += dir

        draggables.splice(destination.index, 0, dragging)

        moveDraggables()
      }

      if (closestTop && draggable.y < closestTop.center + closestTop.bias) {
        moveToDirection(-1)
        return
      }

      if (closestBottom && draggable.y + draggable.height > closestBottom.center + closestBottom.bias) {
        moveToDirection(1)
        return
      }
    }
  }

  // first move
  moveDraggables(`none 0s ease 0s`)

  return {
    onMouseMoving(position: Position) {
      source.subject = getRect({ ...source.subject, ...position })

      onSubjectMoving()

      // auto scroll happens in response to state changes
      if (autoScroll) {
        autoScroll.change(source.subject.center)
      }
    },
    onMouseUp(initPosition: Position) {
      const offset = autoScroll ? autoScroll.getOffset() : origin

      if (autoScroll) {
        autoScroll.cancel()
      }

      // subject out case
      if (destination.listId === null) {
        destination.index = source.index
        destination.listId = source.listId

        lists[destination.listId].draggables.splice(destination.index, 0, outedItem!)

        outedItem = null

        moveDraggables()

        return subtract(initPosition, offset)
      }

      const { droppable, draggables } = lists[destination.listId]

      const getYBottom = ({ bottom, margins }: DraggableItem) => {
        return bottom + margins.bottom
      }

      const topIndex = destination.index - 1

      const position = {
        y: topIndex == -1 ? droppable.top : getYBottom(draggables[topIndex]),
        x: droppable.left
      }

      return subtract(position, offset)
    },
    onDragEnd() {
      const isIndxNotSame = destination.index !== source.index
      const isListNotSame = destination.listId !== source.listId

      if (isIndxNotSame || isListNotSame) {
        if (isListNotSame) {
          placeholder.smoothUnmount(source.listId)
        }

        onDragMoved({
          source: {
            listId: source.listId,
            index: source.index
          },
          destination: {
            listId: destination.listId!,
            index: destination.index
          }
        })
      } else {
        // manual flushing
        placeholder.unmount(source.listId)

        lists[source.listId].draggables.forEach((draggable) => {
          draggable.placement.initial()
          draggable.bias = 0
        })
      }
    }
  }
}

export { createDragManager }
