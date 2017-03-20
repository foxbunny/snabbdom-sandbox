import { Promise } from 'es6-promise'
import xs, { Stream, Producer, Listener } from 'xstream'

import { patch, createView, View, ViewFunction } from './view'
import { createModel, Model } from './model'
import { eventStreamPlugin } from './event'
import pipe from './util/pipe'
import curried from './util/curried'


const createProgram = curried((viewfn: ViewFunction, program: Program) =>
  (input: ProgramInput): ProgramOutput => {
    const view = createView(input.model, viewfn)
    return {
      updates: program({...input, view}),
      view
    }
  }
)


const start = (
  program: Function,
  root: string,
  initialData: any,
  plugins: Function[] = [eventStreamPlugin]) => {

  // Init the model and prepare the program input
  const model = createModel(initialData)
  const input = pipe(...plugins)({
    model: model,
    createView: createView(model)
  })

  // Start the program
  const output: ProgramOutput = program(input)

  // Connect the update stream (if any) to program output
  output.updates ?
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
    : null

  patch(document.querySelector(root), output.view.vnode)
  model.forceEmit()
}


interface ProgramInput {
  on(eventName: string, selector?: string): Stream<Event>
  model: Model
  props?: any
}


interface ProgramOutput {
  updates?: Stream<Function>
  view: View
}


declare type Plugin = (input: Object) => Object


declare type Program = (input: ProgramInput) => Stream<Function>


export {
  createProgram,
  start,
  ProgramInput,
  ProgramOutput,
  Plugin,
  Program
}
