import { useState } from 'react'
import { DragDropContext } from 'dnd/src/DragContext'
import { DropResult } from 'dnd/src/drag-manager/manager'
import { Column } from './Column'

const lists = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']

export const range = (from: number, to: number, step = 1) => {
  const direction = from < to ? 1 : -1
  const distance = Math.abs(from - to) + 1
  const arrayLength = Math.ceil(distance / step)

  const arr = Array<number>(arrayLength)
  for (let index = 0; index < arr.length; index++) {
    arr[index] = from + index * step * direction
  }

  return arr
}

const data = lists.reduce<Record<string, string[]>>(
  (prev, curr) => ({ ...prev, [curr]: range(0, 10).map((n) => `${curr} item ${n}`) }),
  {}
)

export const Board = () => {
  const [state, setState] = useState<Record<string, string[]>>(data)

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
            <div className="flex flex-col gap-14">
              <div className="flex gap-14">
                <Column listId="A" items={state.A} />
                <Column listId="B" items={state.B} />
                <Column listId="C" items={state.C} />
                <Column listId="D" items={state.D} />
                <Column listId="E" items={state.E} />
                <Column listId="F" items={state.F} />
              </div>
              <div className="flex gap-14">
                <Column listId="G" items={state.G} />
                <Column listId="H" items={state.H} />
                <Column listId="I" items={state.I} />
                <Column listId="J" items={state.J} />
                <Column listId="K" items={state.K} />
                <Column listId="L" items={state.L} />
              </div>
              <div className="flex gap-14">
                <Column listId="M" items={state.M} />
                <Column listId="N" items={state.N} />
                <Column listId="O" items={state.O} />
                <Column listId="P" items={state.P} />
                <Column listId="Q" items={state.Q} />
                <Column listId="R" items={state.R} />
              </div>
            </div>
          </DragDropContext>
        </div>
        <div style={{ height: '200px' }} />
      </div>
    </div>
  )
}
