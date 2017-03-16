import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import always = require('ramda/src/always')
import xs from 'xstream'

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

export const updates = (input) => {
  const increment$ = input.on('click', '.increment')
    .map(always(increment))

  const decrement$ = input.on('click', '.decrement')
    .map(always(decrement))

  return xs.merge(increment$, decrement$)
}

export const program = (input) => ({
  updates: updates(input),
  view: input.createView(view)
})

export const init = {count: 0}
