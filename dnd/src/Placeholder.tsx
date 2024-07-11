import { spacing } from './vectors'
import { Lists } from './DragContext'
import { Spacing, px } from './core'

interface Args {
  lists: Lists
  height: number
  margin: Spacing
}

interface Styles {
  height: string
  margin: string
  transition: string
}

const transition = `height 0.2s cubic-bezier(0.2, 0, 0, 1) 0s, margins 0.2s cubic-bezier(0.2, 0, 0, 1) 0s`

export const createPlaceholderAgent = ({ lists, margin, height }: Args) => {
  const set = (listId: string, styles: Partial<Styles>) => {
    const placeholder = lists[listId].placeholder.current

    if (placeholder) {
      placeholder.style.height = styles.height ?? '0px'
      placeholder.style.margin = styles.margin ?? '0px'
      placeholder.style.transition = styles.transition ?? ''
    }
  }

  return {
    add(listId: string) {
      set(listId, { height: px(height), margin: spacing(margin), transition })
    },
    remove(listId: string) {
      set(listId, { transition })
    },
    mount(listId: string) {
      set(listId, { height: px(height), margin: spacing(margin) })
    },
    unmount(listId: string) {
      set(listId, {})
    },
    // will invokes on rerender
    smoothUnmount(listId: string) {
      smoothMountingLib[listId] = true
    }
  }
}

interface PlaceholderProps {
  listId: string
  placeholderRef: React.RefObject<HTMLDivElement>
}

const smoothMountingLib: Record<string, boolean> = {}

export const Placeholder = ({ placeholderRef, listId }: PlaceholderProps) => {
  if (placeholderRef.current) {
    const { style } = placeholderRef.current

    style.height = '0px'
    style.margin = '0px'

    if (smoothMountingLib[listId]) {
      style.transition = transition
      delete smoothMountingLib[listId]
    } else {
      style.transition = ''
    }
  }

  return <div style={{ height: '0px', margin: '0px' }} ref={placeholderRef} />
}
