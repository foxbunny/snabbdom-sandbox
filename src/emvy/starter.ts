import { Promise } from 'es6-promise'
import xs, { Stream, Producer, Listener } from 'xstream'
import { createView, View, ViewFunction } from './view'
import { createModel, Model } from './model'
import { eventStreamPlugin } from './event'

export interface ProgramInput {
  on(eventName: string, selector: string): Stream<Event>
  model: Model
  createView(viewfn: ViewFunction): View
  props?: any
}

export interface ProgramOutput {
  updates: Stream<Function>
  view: View
}

export const compose = (plugins: Function[]) =>
  plugins.reduce((ext1, ext2) => (input) => ext1(ext2(input)))

export const start = (
  program: Function,
  root: string,
  initialData: any,
  plugins: Function[] = [eventStreamPlugin]) => {

  const model = createModel(initialData)
  const input = compose(plugins)({
    model: model,
    createView: createView(model)
  })

  const output: ProgramOutput = program(input)

  // Connect the update stream to program output
  output.updates.addListener({
    next(fn: Function|Promise<Function>) {
      fn instanceof Promise ?
        fn.then(fn => model.update(fn))
        : model.update(fn)
    },
    error(err: any) {
      console.error('event$', err)
    },
  } as Listener<Function>)

  output.view.renderInto(root)
  model.forceEmit()
}