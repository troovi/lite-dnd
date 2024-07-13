import { DraggableList } from 'dnd/src'

export const Column = ({ items, listId }: { items: (string | number)[]; listId: string }) => {
  return (
    <div
      className="drag-test-container p-8"
      style={{ background: 'lightgrey', width: '250px', height: 'max-content' }}
    >
      <DraggableList
        items={items}
        listId={listId}
        onMoveClassName="drag-test-active"
        itemRenderer={({ dragHandleProps, draggableProps }, data) => {
          return (
            <div
              {...draggableProps}
              {...dragHandleProps}
              aria-label={`${data}`}
              className="center mb-12 px-20"
              style={{ height: '40px', background: 'grey' }}
              id={`${listId}-item-${data}`}
            >
              <div> {data}</div>
            </div>
          )
        }}
      />
    </div>
  )
}
