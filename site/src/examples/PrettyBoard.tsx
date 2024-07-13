import { useState } from 'react'
import { DragDropContext, DropResult } from 'dnd/src'
import { Data, data } from './data/data'
import { List } from './lists/PrettyList'

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
                    <div className="mb-12 font-semibold opacity-40">{listId}</div>
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
