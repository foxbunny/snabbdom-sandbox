import { createView, View } from './vdom'
import { createStore, Store } from './store'
import { on } from './event'
import xs, { Stream, Producer, Listener } from 'xstream'

export interface ProgramInput {
  on(eventName: string, selector: string): Stream<Event>
  store: Store
  createView(viewfn: Function): View
}

export interface ProgramOutput {
  updates: Stream<Function>
  view: View
}

export const start = (program: Function, root: string, initialData: any) => {
  // This is the data that will be made available to the program
  const input = {
    on,
    store: createStore(initialData),
    createView: createView(initialData)
  }

  const output: ProgramOutput = program(input)

  // Connect the event stream to program output
  output.updates.addListener({
    next(fn: Function) {
      input.store.update(fn)
    },
    error(err: any) {
      console.error('event$', err)
    },
  } as Listener<Function>)

  // Create a data stream to drive view updates
  xs.create({
    start(listener) {
      input.store.map(listener.next.bind(listener))
    },
    stop() {
      input.store.unmap()
    }
  } as Producer<any>)
    .map(output.view.update)
    .addListener({
      error(err: any) {
        console.error('data$', err)
      }
    } as Listener<any>)

  output.view.renderInto(root)
  input.store.forceEmit()
}
