import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import classes from 'snabbdom/modules/class'
import props from 'snabbdom/modules/props'
import style from 'snabbdom/modules/style'
import h from 'snabbdom/h'

const patch = init([ classes, props, style ])
const root = document.getElementById('app')
console.log(root)
const view = (): VNode =>
  h('p', 'Hello world')

patch(root, view())
