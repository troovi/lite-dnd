import { useState } from 'react'
import { DragDropContext, DropResult } from 'dnd/src'
import { Column } from './lists/SimpleList'

export const ScrollableList = () => {
  const [items, setItems] = useState(Array.from({ length: 100 }, (_, k) => `${k}`))

  const onDragMoved = ({ destination, source }: DropResult) => {
    const reorderedItems = [...items]

    const [removed] = reorderedItems.splice(source.index, 1)
    reorderedItems.splice(destination.index, 0, removed)

    setItems(reorderedItems)
  }

  return (
    <div className="full center relative h-full">
      <div className="overflow-y-scroll" style={{ height: '500px' }}>
        <DragDropContext onDragMoved={onDragMoved}>
          <Column listId="id-1" items={items} />
        </DragDropContext>
      </div>
    </div>
  )
}
