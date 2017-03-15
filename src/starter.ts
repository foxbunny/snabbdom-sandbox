import { createView, View } from './vdom'
import { createModel, Model } from './model'
import { on } from './event'
import xs, { Stream, Producer, Listener } from 'xstream'

export interface ProgramInput {
  on(eventName: string, selector: string): Stream<Event>
  store: Model
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
    model: createModel(initialData),
    createView: createView(initialData)
  }

  const output: ProgramOutput = program(input)

  // Connect the event stream to program output
  output.updates.addListener({
    next(fn: Function) {
      input.model.update(fn)
    },
    error(err: any) {
      console.error('event$', err)
    },
  } as Listener<Function>)

  // Create a data stream to drive view updates
  xs.create({
    start(listener) {
      input.model.map(listener.next.bind(listener))
    },
    stop() {
      input.model.unmap()
    }
  } as Producer<any>)
    .map(output.view.update)
    .addListener({
      error(err: any) {
        console.error('data$', err)
      }
    } as Listener<any>)

  output.view.renderInto(root)
  input.model.forceEmit()
}
