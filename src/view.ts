import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import classes from 'snabbdom/modules/class'
import props from 'snabbdom/modules/props'
import style from 'snabbdom/modules/style'

export const patch = init([ classes, props, style ])

export interface View {
  update(data: any): void
  renderInto(root: string): void
}

export const createView = (initialData: any) => (viewfn: Function): View => {
  let vnodes: VNode = viewfn(initialData)
  return {
    update(data: any) {
      const newVnodes = viewfn(data)
      patch(vnodes, newVnodes)
      vnodes = newVnodes
    },
    renderInto(root: string) {
      patch(document.querySelector(root), vnodes)
    }
  }
}
