export const getBodyElement = (): HTMLBodyElement => {
  return document.body! as HTMLBodyElement
}

interface Overflow {
  overflowX: string
  overflowY: string
}

const isEqual = (base: string) => (value: string) => base === value

const isScroll = isEqual('scroll')
const isAuto = isEqual('auto')
const isVisible = isEqual('visible')

const isEither = (overflow: Overflow, fn: (value: string) => boolean) => {
  return fn(overflow.overflowX) || fn(overflow.overflowY)
}

const isBoth = (overflow: Overflow, fn: (value: string) => boolean) => {
  return fn(overflow.overflowX) && fn(overflow.overflowY)
}

const isElementScrollable = (el: Element): boolean => {
  const style: CSSStyleDeclaration = window.getComputedStyle(el)

  const overflow: Overflow = {
    overflowX: style.overflowX,
    overflowY: style.overflowY
  }

  return isEither(overflow, isScroll) || isEither(overflow, isAuto)
}

// Special case for a body element
// Playground: https://codepen.io/alexreardon/pen/ZmyLgX?editors=1111
const isBodyScrollable = (): boolean => {
  // Because we always return false for now, we can skip any actual processing in production
  if (process.env.NODE_ENV === 'production') {
    return false
  }

  const body: HTMLBodyElement = getBodyElement()
  const html: HTMLElement = document.documentElement

  // 1. The `body` has `overflow-[x|y]: auto | scroll`
  if (!isElementScrollable(body)) {
    return false
  }

  const htmlStyle: CSSStyleDeclaration = window.getComputedStyle(html)
  const htmlOverflow: Overflow = {
    overflowX: htmlStyle.overflowX,
    overflowY: htmlStyle.overflowY
  }

  if (isBoth(htmlOverflow, isVisible)) {
    return false
  }

  return false
}

export const getClosestScrollable = (el: HTMLElement | null): HTMLElement | null => {
  // cannot do anything else!
  if (el == null) {
    return null
  }

  // not allowing us to go higher then body
  if (el === document.body) {
    return isBodyScrollable() ? el : null
  }

  // Should never get here, but just being safe
  if (el === document.documentElement) {
    return null
  }

  if (!isElementScrollable(el)) {
    // keep recursing
    return getClosestScrollable(el.parentElement)
  }

  // success!
  return el
}

// Droppable: unsupported nested scroll container detected.
// A Droppable can only have one scroll parent (which can be itself)
// Nested scroll containers are not supported.
