import { getClosestScrollable } from '../get-closest-scrollable'
import { createDragManager, ListsData, Source } from './manager'
import { getMargins, getRect } from '../vectors'
import { createPlaceholderAgent } from '../Placeholder'
import { ContextValue } from '../DragContext'

export const getDragManager = ({ lists, onDragMoved }: ContextValue, source: Source) => {
  const { droppable } = lists[source.listId]

  const placeholder = createPlaceholderAgent({
    lists,
    height: source.subject.height,
    margin: source.margins
  })

  // mount placeholder before getting dimensions,
  // because createDragManager calls after applying position:fixed to subject
  placeholder.mount(source.listId)

  const listsData: ListsData = {}

  // calculate dimensions
  for (const droppableId in lists) {
    const { droppable, draggables } = lists[droppableId]

    listsData[droppableId] = {
      droppable: getRect(droppable.current!.getBoundingClientRect()),
      draggables: draggables.map(({ ref, placement }) => {
        const { top, height } = ref.current!.getBoundingClientRect()

        return {
          placement,
          bias: 0,
          label: ref.current?.ariaLabel ?? '',
          margins: getMargins(ref.current!),
          bottom: top + height,
          center: top + height / 2
        }
      })
    }
  }

  return createDragManager({
    scrollable: getClosestScrollable(droppable.current),
    lists: listsData,
    placeholder,
    onDragMoved,
    source
  })
}
