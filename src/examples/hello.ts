import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import { always } from 'ramda'

import { ProgramInput } from '../emvy/starter'
import { SimpleOutput, mapView } from '../emvy/view'

export const view = (data: {name: string}): VNode =>
  h('p', [
    h('p', 'Hello, ' + data.name),
    h('p', [
      h('input.name', {props: {value: data.name}})
    ])
  ])

export interface InputEvent extends Event {
  target: HTMLInputElement
}

export const updates = (input: ProgramInput) =>
  input.on('input', '.name')
    .map((e: InputEvent): String => e.target.value)
    .map((name: string) => (data: any): any => ({...data, name: name}))

export const program = mapView((input: ProgramInput): SimpleOutput => ({
  updates: updates(input),
  view: view
}))

export const init = {name: 'World'}
