import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import classes from 'snabbdom/modules/class'
import props from 'snabbdom/modules/props'
import style from 'snabbdom/modules/style'

import { Model } from './model'

export const patch = init([ classes, props, style ])

export interface View {
  vnodes: VNode,
  renderInto(root: string): void
}

export const createView = (model: Model) => (viewfn: Function): View => {
  let vnodes: VNode = viewfn(model.data)
  let destroyHook: Function

  const update = data => {
    const newVnodes = viewfn(data)
    patch(vnodes, newVnodes)
    vnodes = newVnodes
    vnodes.data.hooks = (vnodes.data.hook || {}).destroy = () => destroyHook()
  }

  model.subscribe(update)
  destroyHook = () => model.unsubscribe(update)
  vnodes.data.hooks = (vnodes.data.hook || {}).destroy = () => destroyHook()

  return {
    get vnodes() {
      return vnodes
    },
    renderInto(root: string) {
      patch(document.querySelector(root), vnodes)
    }
  }
}
