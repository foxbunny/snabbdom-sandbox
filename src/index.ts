import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import always = require('ramda/src/always')
import xs from 'xstream'

import { start } from './starter'

const mainView = (data: {name: string}): VNode =>
  h('p', [
    h('p', 'Hello, ' + data.name),
    h('p', [
      h('input.name', {props: {value: data.name}})
    ])
  ])

const program = (input) => {
  const input$ = input.on('input', '.name')
    .map(e => e.target.value)
    .map(name => data => ({...data, name: name}))

  return {
    updates: input$,
    view: input.createView(mainView)
  }
}

start(program, '#app', {name: 'World'})
