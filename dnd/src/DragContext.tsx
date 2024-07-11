import { createContext } from 'react'
import { PlacementManager } from './Draggable'
import { DropResult } from './drag-manager/manager'

export type Lists = {
  [listId: string]: {
    placeholder: React.RefObject<HTMLDivElement>
    droppable: React.RefObject<HTMLElement>
    draggables: { ref: React.RefObject<HTMLElement>; placement: PlacementManager }[]
  }
}

export interface ContextValue {
  onDragMoved: (result: DropResult) => void
  isDragging: boolean
  // forceDragEnd: null | (() => void)
  lists: Lists
}

export const DragContext = createContext<ContextValue | null>(null)

interface DragDropContextProps {
  children: React.ReactNode
  onDragMoved: (result: DropResult) => void
}

export const DragDropContext = ({ children, onDragMoved }: DragDropContextProps) => {
  const value: ContextValue = {
    lists: {},
    isDragging: false,
    // forceDragEnd: null,
    onDragMoved
  }

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>
}
