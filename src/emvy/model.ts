export interface Model {
  data: any
  subscribe(fn: Function): void
  unsubscribe(fn: Function): void
  update(fn: Function): void
  forceEmit(): void
}

export const createModel = (initialData: any): Model => {
  let data: any = initialData
  let subscribers: Function[] = []

  const emit = () => {
    if (!subscribers.length) return
    subscribers.forEach(fn => { fn(data) })
  }

  return {
    get data() {
      return data
    },

    subscribe(fn: Function) {
      subscribers = subscribers.concat([fn])
    },

    unsubscribe(fn: Function) {
      subscribers = subscribers.filter(sub => fn !== sub)
    },

    update(fn: Function) {
      data = fn(data)
      emit()
    },

    forceEmit() {
      emit()
    }
  }
}
