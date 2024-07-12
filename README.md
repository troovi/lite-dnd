### About

This library was inspired by <code>react-beautiful-dnd</code>, but it is more performant and x20 times lighter, and does not rely on heavy additional libraries like redux and react-redux.

<b>Features:</b>

1. Dragging between one or more draggable-list
2. Mouse, and touch support
3. Auto scrolling - automatically scroll containers as required during a drag
4. Custom drag handles - you can drag a whole item by just a part of it
5. Flexible item sizes - the draggable items can have different heights

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

Dragging between two list:

```javascript
import { useState } from "react";
import { DragDropContext, DraggableList, DropResult } from "lite-dnd";

export const TwoList = () => {
  const [state, setState] = useState<Record<string, number[]>>({
    "list-a": [1, 2, 3, 4, 5, 6, 7, 8],
    "list-b": [1, 2, 3, 4, 5, 6, 7, 8],
  });

  const onDragMoved = ({ source, destination }: DropResult) => {
    const nextState = { ...state };

    const [target] = nextState[source.listId].splice(source.index, 1);
    nextState[destination.listId].splice(destination.index, 0, target);

    setState(nextState);
  };

  return (
    <div className="h-screen w-full flex py-[40px] justify-center">
      <DragDropContext onDragMoved={onDragMoved}>
        <div className="flex gap-14">
          <List listId="list-a" items={state["list-a"]} />
          <List listId="list-b" items={state["list-b"]} />
        </div>
      </DragDropContext>
    </div>
  );
};

const List = ({ items, listId }: { items: number[]; listId: string }) => {
  return (
    <div className="w-[250px]">
      <DraggableList
        items={items}
        listId={listId}
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
  );
};

```
