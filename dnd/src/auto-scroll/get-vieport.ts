// @flow
import { getRect } from '../vectors'

export const getScrollableView = (el: HTMLElement) => {
  const scrollable = getRect(el.getBoundingClientRect())
  // window.innerHeight: includes scrollbars (not what we want)
  // document.clientHeight gives us the correct value when using the html5 doctype
  const doc: HTMLElement = document.documentElement
  // Using these values as they do not consider scrollbars
  // padding box, without scrollbar
  const viewport = {
    width: doc.clientWidth,
    height: doc.clientHeight
  }

  const height = (() => {
    if (scrollable.bottom > viewport.height) {
      return viewport.height - scrollable.y
    }

    return scrollable.height
  })()

  const width = (() => {
    if (scrollable.right > viewport.width) {
      return viewport.width - scrollable.x
    }

    return scrollable.width
  })()

  return getRect({
    x: scrollable.x,
    y: scrollable.y,
    height,
    width
  })
}
