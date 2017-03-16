import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs from 'xstream'
import identity from 'ramda/src/identity'

import { ProgramInput, ProgramOutput } from '../emvy/starter'

export const view = (props: {user: any}): Function => (): VNode =>
  h('div.user', [
    h('h2', props.user.name),
    h('p', props.user.email)
  ])

export const program = (input: ProgramInput): ProgramOutput => {
  return {
    updates: xs.of(identity),
    view: input.createView(view(input.props))
  }
}
