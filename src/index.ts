import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import always = require('ramda/src/always')
import xs from 'xstream'

import { start } from './starter'

const mainView = (data: any): VNode =>
  h('p', [
    h('button.increment', 'Increment'),
    h('button.decrement', 'Decrement'),
    h('span', 'Count: ' + data.count)
  ])

const increment = (data: {count: number}) =>
  ({...data, count: data.count + 10})

const decrement = (data: {count: number}) =>
  ({...data, count: data.count - 10})

const program = (input) => {
  const increment$ = input.on('click', '.increment')
    .map(always(increment))

  const decrement$ = input.on('click', '.decrement')
    .map(always(decrement))

  const action$ = xs.merge(increment$, decrement$)

  return {
    updates: action$,
    view: input.createView(mainView)
  }
}

start(program, '#app', {count: 0})
