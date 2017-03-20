import h from 'snabbdom/h'
import { Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'
import { always } from 'ramda'

import { ProgramInput, createProgram } from '../emvy/starter'
import html from '../emvy/html'
import merge from '../emvy/util/merge'


const { p, input } = html


export const modelView = (data: {name: string}): VNode =>
  p([
    p('Hello, ' + (data.name.length ? data.name : 'World')),
    p(input('.name', {props: {value: data.name}}))
  ])

export const eventModel = (input: ProgramInput): Stream<Function> =>
  input.on('input', '.name')
    .map((e: InputEvent): String => e.target.value)
    .map((name: string) => merge({name: name}))


export const program = createProgram(modelView, eventModel)


export const init = {name: 'World'}


export interface InputEvent extends Event {
  target: HTMLInputElement
}

