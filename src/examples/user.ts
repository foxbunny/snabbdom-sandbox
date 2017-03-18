import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs from 'xstream'

import { Program, ProgramInput } from '../emvy/starter'
import { mapView, SimpleOutput } from '../emvy/view'

interface UserProps {
  user: any
}

export const view = (props: UserProps) => (): VNode =>
  h('div.user', [
    h('h2', props.user.name),
    h('p', h('a', {props: {href: 'mailto:' + props.user.email}}, 'email'))
  ])

export const program: Program = mapView((input: ProgramInput): SimpleOutput => {
  return {
    view: view(input.props)
  }
})
