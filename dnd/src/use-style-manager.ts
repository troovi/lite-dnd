
import { useEffect } from 'react'

export const createStyleEl = (content?: string): HTMLStyleElement => {
  const el: HTMLStyleElement = document.createElement('style')
  if (content) {
    el.textContent = content
  }
  el.type = 'text/css'
  return el
}

export const getHead = (): HTMLHeadElement => {
  return document.querySelector('head')!
}

const getStyles = (rule: { selector: string; styles: string }) => {
  return `${rule.selector} { ${rule.styles} }`
}

const styles = {
  grab: getStyles({
    selector: `[data-dnd-handle="0"]`,
    styles: `
      cursor: -webkit-grab;
      cursor: grab;
    `
  }),
  grabbing: getStyles({
    selector: `[data-dnd-handle="0"]`,
    styles: `
      cursor: grabbing;
      cursor: -webkit-grabbing;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      overflow-anchor: none;
    `
  }),
  draggables: getStyles({
    selector: `[data-dnd-draggable="0"]`,
    styles: `
      transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
    `
  })
}

const tags = {
  handler: null as null | HTMLStyleElement,
  draggable: null as null | HTMLStyleElement
}

const setChange = (el: HTMLStyleElement | null, content: string) => {
  if (el) el.textContent = content
}

export const useStyleManager = () => {
  useEffect(() => {
    if (!tags.draggable && !tags.handler) {
      const cursor = createStyleEl()
      const draggable = createStyleEl()
      const handler = createStyleEl()

      getHead().appendChild(cursor)
      getHead().appendChild(draggable)
      getHead().appendChild(handler)

      tags.draggable = draggable
      tags.handler = handler

      // default cursor style
      setChange(tags.handler, styles.grab)
    }
  }, [])

  return {
    draggables: {
      animate() {
        setChange(tags.draggable, styles.draggables)
      },
      static() {
        setChange(tags.draggable, '')
      }
    },
    handler: {
      grabbing() {
        setChange(tags.handler, styles.grabbing)
      },
      resting() {
        setChange(tags.handler, styles.grab)
      }
    }
  }
}

export type StyleManager = ReturnType<typeof useStyleManager>
