type EventBinding<K extends keyof WindowEventMap> = {
  eventName: K
  fn: (this: Window, ev: WindowEventMap[K]) => void
  options?: boolean | AddEventListenerOptions | undefined
}

type Bind = <K extends keyof WindowEventMap>(event: EventBinding<K>) => () => void

export const bindEvents = (getBinds: (bind: Bind) => (() => void)[]) => {
  const unbindings = getBinds((binding) => {
    window.addEventListener(binding.eventName, binding.fn, binding.options)

    return () => {
      window.removeEventListener(binding.eventName, binding.fn, binding.options)
    }
  })

  return () => {
    unbindings.forEach((unbind) => {
      unbind()
    })
  }
}
