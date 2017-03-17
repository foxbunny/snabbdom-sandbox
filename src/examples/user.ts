import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs from 'xstream'

import { ProgramInput } from '../emvy/starter'
import { mapView, SimpleOutput } from '../emvy/view'

interface UserProps {
  user: any
}

export const view = (props: UserProps) => (): VNode =>
  h('div.user', [
    h('h2', props.user.name),
    h('p', h('a', {props: {href: 'mailto:' + props.user.email}}, 'email'))
  ])

export const program = mapView((input: ProgramInput) => {
  return {
    view: view(input.props)
  } as SimpleOutput
})
