import { useState } from 'react'
import { DragDropContext, DropResult } from 'dnd/src'
import { Column } from './lists/SimpleList'
import { range } from './MultiLists'

export const TwoList = () => {
  const [state, setState] = useState<Record<string, string[]>>({
    A: range(0, 10).map((n) => `A item ${n}`),
    B: range(0, 10).map((n) => `B item ${n}`),
    C: range(0, 10).map((n) => `C item ${n}`)
  })

  const onDragMoved = ({ source, destination }: DropResult) => {
    const nextState = { ...state }

    const [target] = nextState[source.listId].splice(source.index, 1)
    nextState[destination.listId].splice(destination.index, 0, target)

    setState(nextState)
  }

  return (
    <div className="full p-40">
      <div>
        <DragDropContext onDragMoved={onDragMoved}>
          <div className="flex justify-center gap-14">
            <Column listId="A" items={state.A} />
            <Column listId="B" items={state.B} />
            <Column listId="C" items={state.C} />
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
