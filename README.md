### About

This library was inspired by <code>react-beautiful-dnd</code>, but it is more performant and x20 times lighter, and does not rely on heavy additional libraries like redux and react-redux.

### Usage examples

One list:

```javascript
import { useState } from "react";
import { DragDropContext, DraggableList, DropResult } from "lite-dnd";

export const SimpleList = () => {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  const onDragMoved = ({ source, destination }: DropResult) => {
    const nextState = [...items];

    const [target] = nextState.splice(source.index, 1);
    nextState.splice(destination.index, 0, target);

    setItems(nextState);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <DragDropContext onDragMoved={onDragMoved}>
        <div className="w-[250px]">
          <DraggableList
            items={items}
            listId="your-list-id"
            itemRenderer={({ dragHandleProps, draggableProps }, data) => {
              return (
                <div
                  {...draggableProps}
                  {...dragHandleProps}
                  className="mb-12 flex items-center justify-between px-20"
                  style={{ height: "40px", background: "grey" }}
                >
                  <div>{data}</div>
                </div>
              );
            }}
          />
        </div>
      </DragDropContext>
    </div>
  );
};
```
