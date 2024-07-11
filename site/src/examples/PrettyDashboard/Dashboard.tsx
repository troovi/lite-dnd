import './styles.css'
import { useState } from 'react'
import { DragDropContext, DropResult } from 'dnd/src'
import { Data, DataItem, data } from './data'
import { List } from './List'

export const PrettyBoard = () => {
  const [state, setState] = useState<Data>(data)

  const onDragMoved = ({ source, destination }: DropResult) => {
    const nextState = { ...state }

    const [target] = nextState[source.listId].splice(source.index, 1)
    nextState[destination.listId].splice(destination.index, 0, target)

    setState(nextState)
  }

  return (
    <div className="full h-screen">
      <div className="full overflow-scroll">
        <div className="w-max p-40">
          <DragDropContext onDragMoved={onDragMoved}>
            <div className="flex h-full gap-14">
              {Object.keys(data).map((listId, i) => {
                return (
                  <div key={`${listId}-${i}`} className="column flex flex-col p-8">
                    <div className="quieter mb-12 mt-8 font-semibold">{listId}</div>
                    <List items={state[listId]} listId={listId} />
                  </div>
                )
              })}
            </div>
          </DragDropContext>
        </div>
        <div style={{ height: '200px' }} />
      </div>
    </div>
  )
}

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
    <div className="full center relative h-screen" style={{ background: '#f1f1f1' }}>
      <div className="pretty-list overflow-y-scroll p-10">
        <DragDropContext onDragMoved={onDragMoved}>
          <List listId="id-1" items={items} />
        </DragDropContext>
      </div>
    </div>
  )
}
