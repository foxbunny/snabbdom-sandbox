export interface Model {
  data: any
  map(fn: Function): void
  unmap(): void
  update(fn: Function): void
  forceEmit(): void
}

export const createModel = (initialData: any): Model => {
  let data: any = initialData
  let subscriber: (Function | null) = null

  const emit = () => {
    subscriber ?
      subscriber(data)
      : null
  }

  return {
    get data() {
      return data
    },

    map(fn: Function) {
      subscriber = fn
    },

    unmap() {
      subscriber = null
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
