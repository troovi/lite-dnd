import { useState } from 'react'
import { DataItem, data } from './data/data'
import { DragDropContext, DropResult } from 'dnd/src'
import { List } from './lists/PrettyList'

export const PrettyList = () => {
  const [items, setItems] = useState<DataItem[]>(
    Object.values(data).reduce((prev, curr) => [...prev, ...curr], [])
  )

  const onDragMoved = ({ source, destination }: DropResult) => {
    const reorderedItems = [...items]

    const [removed] = reorderedItems.splice(source.index, 1)
    reorderedItems.splice(destination.index, 0, removed)

    setItems(reorderedItems)
  }

  return (
    <div className="full relative flex flex-col items-center justify-between">
      <div></div>
      <div className="pretty-list overflow-y-scroll p-10">
        <DragDropContext onDragMoved={onDragMoved}>
          <List listId="id-1" items={items} />
        </DragDropContext>
      </div>
      <div></div>
    </div>
  )
}
