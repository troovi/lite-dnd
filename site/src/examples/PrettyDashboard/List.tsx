import { DraggableList } from 'dnd/src'
import { DataItem } from './data'
import { avatars } from '../../../public/assets'

interface Props {
  items: DataItem[]
  listId: string
}

export const List = ({ items, listId }: Props) => {
  return (
    <DraggableList
      items={items}
      listId={listId}
      onMoveClassName="drag-element--active"
      droppableClassName="column-draggable"
      itemRenderer={({ dragHandleProps, draggableProps }, data) => (
        <div
          {...draggableProps}
          {...dragHandleProps}
          aria-label={`${data}`}
          className="drag-element mb-12 flex gap-10"
          style={{ minHeight: '40px' }}
          id={`${listId}-item-${data}`}
        >
          <div>
            <div
              className="image rounded-full"
              style={{
                ...box(42),
                backgroundImage: `url(./assets/${encodeURIComponent(avatars[data.i])})`
              }}
            />
          </div>
          <div>
            <div>{data.text}</div>
            <div className="tag mt-6 w-max">{avatars[data.i].split('.')[0]}</div>
          </div>
        </div>
      )}
    />
  )
}

export const box = (h: number = 48, w?: number) => {
  if (!w) w = h
  return {
    width: w,
    minWidth: w,
    minHeight: h,
    height: h
  }
}
