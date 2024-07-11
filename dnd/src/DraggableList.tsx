import { useRef, useContext } from 'react'
import { DragProps, Draggable } from './Draggable'
import { DragContext } from './DragContext'
import { Placeholder } from './Placeholder'

interface Props<T> {
  listId: string
  items: T[]
  onMoveClassName?: string
  droppableClassName?: string
  noResults?: React.ReactNode
  itemRenderer: (provided: DragProps, data: T) => JSX.Element
}

export const DraggableList = <T,>({
  listId,
  items,
  noResults,
  itemRenderer,
  ...classNames
}: Props<T>) => {
  const appContext = useContext(DragContext)

  if (!appContext) {
    throw Error('Could not find drag context')
  }

  const droppableRef = useRef<HTMLDivElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)

  appContext.lists[listId] = {
    droppable: droppableRef,
    draggables: [],
    placeholder: placeholderRef
  }

  return (
    <div ref={droppableRef} aria-label="droppable" className={classNames.droppableClassName}>
      {items.length === 0
        ? noResults
        : items.map((itemData, i) => (
            <Draggable
              key={`dnd-item--${listId}-${i}`}
              context={appContext}
              onMoveClassName={classNames.onMoveClassName}
              listId={listId}
              index={i}
            >
              {(props) => itemRenderer(props, itemData)}
            </Draggable>
          ))}
      <Placeholder listId={listId} placeholderRef={placeholderRef} />
    </div>
  )
}
