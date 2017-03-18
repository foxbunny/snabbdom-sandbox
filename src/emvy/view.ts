import { Stream } from 'xstream'
import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import props from 'snabbdom/modules/props'
import style from 'snabbdom/modules/style'

import { ProgramInput, ProgramOutput } from './starter'
import { Model } from './model'

export const patch = init([ props, style ])

export interface View {
  vnodes: VNode,
  renderInto(root: string): void
}

export interface SimpleOutput {
  updates?: Stream<Function>
  view: ViewFunction
}

export declare type PartialProgram = (input: ProgramInput) => SimpleOutput

export declare type ViewFunction = (data: any) => VNode

export const createView = (model: Model) => (viewfn: ViewFunction): View => {
  let vnodes: VNode = viewfn(model.data)
  let destroyHook: Function

  const update = (data: any): void => {
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
    renderInto(root: string): void {
      patch(document.querySelector(root), vnodes)
    }
  }
}

export const mapView = (program: Function) => (input: ProgramInput) => {
  const output: SimpleOutput = program(input)
  return {
    ...output,
    view: createView(input.model)(output.view)
  } as ProgramOutput
}
