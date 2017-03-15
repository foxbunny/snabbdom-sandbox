import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import always = require('ramda/src/always')

export const view = (data: {name: string}): VNode =>
  h('p', [
    h('p', 'Hello, ' + data.name),
    h('p', [
      h('input.name', {props: {value: data.name}})
    ])
  ])

export const updates = (input) =>
  input.on('input', '.name')
    .map(e => e.target.value)
    .map(name => data => ({...data, name: name}))

export const program = (input) => ({
  updates: updates(input),
  view: input.createView(view)
})

export const init = {name: 'World'}
