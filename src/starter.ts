import { createView, View } from './view'
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
  const model = createModel(initialData)
  const input = {
    on,
    model: model,
    createView: createView(model)
  }

  const output: ProgramOutput = program(input)

  // Connect the event stream to program output
  output.updates.addListener({
    next(fn: Function) {
      model.update(fn)
    },
    error(err: any) {
      console.error('event$', err)
    },
  } as Listener<Function>)

  output.view.renderInto(root)
  model.forceEmit()
}
