import { MultiLists } from './MultiLists'
import { PrettyBoard } from './PrettyBoard'
import { PrettyList } from './PrettyList'
import { ScrollableList } from './ScrollableList'
import { TwoList } from './TwoList'

export const examples = [
  {
    name: 'Pretty kanban-board',
    source: <PrettyBoard />
  },
  {
    name: 'Pretty List',
    source: <PrettyList />
  },
  {
    name: 'Two Simple List',
    source: <TwoList />
  },
  {
    name: 'Scrollable List (100 items)',
    source: <ScrollableList />
  },
  {
    name: 'Multiple Litst (x,y scrolling)',
    source: <MultiLists />
  }
]
