import { bindEvents } from './bind'

export const preventNextClick = () => {
  const unbind = bindEvents((bind) => [
    bind({
      eventName: 'click',
      fn: (e) => {
        e.stopPropagation()
        e.preventDefault()
      },
      options: {
        once: true,
        passive: false,
        capture: true
      }
    })
  ])
  // Sometimes the click is swallowed, such as when there is reparenting
  // The click event (in the message queue) will occur before the next setTimeout expiry
  // https://codesandbox.io/s/click-behaviour-pkfk2
  setTimeout(unbind)
}
