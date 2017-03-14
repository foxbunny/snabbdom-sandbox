import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import classes from 'snabbdom/modules/class'
import props from 'snabbdom/modules/props'
import style from 'snabbdom/modules/style'
import h from 'snabbdom/h'
import xs, { Stream, Producer, Listener } from 'xstream'
import always = require('ramda/src/always')

import { targetMatches } from './matches'

const patch = init([ classes, props, style ])

const view = (data: any): VNode =>
  h('p', [
    h('button.increment', 'Increment'),
    h('button.decrement', 'Decrement'),
    h('span', 'Count: ' + data.count)
  ])

const store = {
  data: {count: 0},
  subscriber: null,

  map(fn: Function) {
    this.subscriber = fn
  },

  unmap() {
    this.subscriber = null
  },

  update(fn: Function) {
    this.data = fn(this.data)
    this.emit()
  },

  emit() {
    if (this.subscriber === null) return
    this.subscriber(this.data)
  }
}

const increment = (data: {count: number}) => ({...data, count: data.count + 10})
const decrement = (data: {count: number}) => ({...data, count: data.count - 10})

const update = () => store.update(increment)

// Initial view

let initialVnodes = view(store.data)

// Input streams: events -> data

const event$: Stream<Event> = xs.create({
  start(listener: Listener<Event>) {
    this.listener = listener.next.bind(listener)
    document.addEventListener('click', this.listener)
  },
  stop() {
    document.removeEventListener('click', this.listener)
  }
} as Producer<Event>)

const increment$ = event$
  .filter(targetMatches('.increment'))
  .map(always(increment))

const decrement$ = event$
  .filter(targetMatches('.decrement'))
  .map(always(decrement))

const action$ = xs.merge(increment$, decrement$)

action$
  .addListener({
    next(fn) {
      store.update(fn)
    },
    error(err: any) {
      console.error('event$', err)
    },
  } as Listener<Function>)

// Output streams: data -> vnodes

const data$: Stream<{any}> = xs.create({
  start(listener) {
    store.map(listener.next.bind(listener))
  },
  stop() {
    store.unmap()
  }
} as Producer<any>)

data$
  .map(view)
  .addListener({
    next(vnodes: VNode) {
      patch(initialVnodes, vnodes)
      initialVnodes = vnodes
    },
    error(err: any) {
      console.error('data$', err)
    }
  } as Listener<VNode>)


const start = (initialView: VNode, root: string) => {
  patch(document.querySelector(root), initialView)
  store.emit()
}

start(initialVnodes, '#app')
