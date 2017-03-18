import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import { always } from 'ramda'
import xs, { Stream } from 'xstream'

import { Program, ProgramInput } from '../emvy/starter';
import { SimpleOutput, mapView } from '../emvy/view'

export const view = (data: any): VNode =>
  h('p', [
    h('button.increment', 'Increment'),
    h('button.decrement', 'Decrement'),
    h('span', 'Count: ' + data.count)
  ])

export const increment = (data: {count: number}) =>
  ({...data, count: data.count + 10})

export const decrement = (data: {count: number}) =>
  ({...data, count: data.count - 10})

export const updates = (input: ProgramInput): Stream<Function> => {
  const increment$ = input.on('click', '.increment')
    .map(always(increment))

  const decrement$ = input.on('click', '.decrement')
    .map(always(decrement))

  return xs.merge(increment$, decrement$)
}

export const program: Program = mapView((input: ProgramInput): SimpleOutput => ({
  updates: updates(input),
  view: view
}))

export const init = {count: 0}
