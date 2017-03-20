import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import { always } from 'ramda'
import xs, { Stream } from 'xstream'

import { Program, ProgramInput, createProgram } from '../emvy/starter';


export const modelView = (data: any): VNode =>
  h('p', [
    h('button.increment', 'Increment'),
    h('button.decrement', 'Decrement'),
    h('span', 'Count: ' + data.count)
  ])


const increment = (data: {count: number}) =>
  ({...data, count: data.count + 10})


const decrement = (data: {count: number}) =>
  ({...data, count: data.count - 10})


export const eventModel = (input: ProgramInput): Stream<Function> => {
  const increment$ = input.on('click', '.increment')
    .map(always(increment))

  const decrement$ = input.on('click', '.decrement')
    .map(always(decrement))

  return xs.merge(increment$, decrement$)
}


export const program: Program = createProgram(modelView, eventModel)


export const init = {count: 0}
