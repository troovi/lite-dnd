import rafSchedule from 'raf-schd'

import { Position, Rect } from '../core'
import { getMaxScroll } from './get-max-scroll'
import { getRect, subtract } from '../vectors'
import { getScrollChange } from './get-scroll-change'
import { getScroll } from './get-scroll'
import { dampenValueByTime } from './dampen-value-by-time'
import { getScrollableView } from './get-vieport'

type ScheduledFn<T extends (...args: any[]) => void> = T & { cancel(): void }

interface Opts {
  center: Position
  onScroll: () => void
  isSubjectInScrollable: (scrollable: Rect) => boolean
}

export class AutoScroll {
  scrollable: Rect

  private ref: HTMLElement
  private initial: Position
  private value: null | Position
  private max: Position
  private scheduleScrollUpdate: ScheduledFn<() => void>
  private shouldUseTimeDampening: boolean
  private dragStartTime: number

  private onScroll: () => void
  private scrollListener: () => void
  private isSubjectInScrollable: (scrollable: Rect) => boolean

  constructor(el: HTMLElement, { onScroll, isSubjectInScrollable, center }: Opts) {
    this.ref = el
    this.onScroll = onScroll
    this.shouldUseTimeDampening = false
    this.initial = {
      x: el.scrollLeft,
      y: el.scrollTop
    }

    this.value = null

    this.max = getMaxScroll({
      height: el.clientHeight,
      width: el.clientWidth,
      scrollHeight: el.scrollHeight,
      scrollWidth: el.scrollWidth
    })

    const scrollable = getScrollableView(el)

    const scheduleScrollUpdate = rafSchedule(this.changeScroll.bind(this))

    this.scrollable = scrollable

    this.scrollListener = () => {
      if (isSubjectInScrollable(scrollable)) {
        scheduleScrollUpdate()
      }
    }

    this.isSubjectInScrollable = isSubjectInScrollable
    this.scheduleScrollUpdate = scheduleScrollUpdate
    this.dragStartTime = Date.now()

    if (getScroll({ container: this.scrollable, center }) !== null) {
      this.shouldUseTimeDampening = true
    }

    // bind scroll listener
    el.addEventListener('scroll', this.scrollListener)
  }

  private changeScroll() {
    if (this.value) {
      const dampen = (value: number) => {
        return Math.max(dampenValueByTime(Math.abs(value), this.dragStartTime), 1) * Math.sign(value)
      }

      const { x, y } = (() => {
        if (this.shouldUseTimeDampening) {
          return {
            x: dampen(this.value.x),
            y: dampen(this.value.y)
          }
        }

        return this.value
      })()

      this.ref.scrollTop += y
      this.ref.scrollLeft += x

      this.onScroll()
    }
  }

  // public api

  change(center: Position) {
    if (this.isSubjectInScrollable(this.scrollable)) {
      const { scrollLeft, scrollTop } = this.ref

      this.value = getScrollChange({
        container: this.scrollable,
        center,
        scroll: {
          max: this.max,
          current: {
            x: scrollLeft,
            y: scrollTop
          }
        }
      })

      this.changeScroll()
    }
  }

  cancel() {
    this.scheduleScrollUpdate.cancel()
    this.ref.removeEventListener('scroll', this.scrollListener)
  }

  getOffset() {
    const { scrollLeft: x, scrollTop: y } = this.ref
    return subtract({ x, y }, this.initial)
  }
}
