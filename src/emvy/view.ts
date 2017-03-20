import xs, { Stream, Listener } from 'xstream'
import { init } from 'snabbdom'
import { VNode } from 'snabbdom/vnode'
import props from 'snabbdom/modules/props'
import style from 'snabbdom/modules/style'

import { Program, ProgramInput, ProgramOutput } from './starter';
import { Model } from './model'
import identity from './util/identity'
import curriedN from './util/curriedN'
import merge from './util/merge'


export const patch = init([ props, style ])


const hookStream = (adapt: Function): HookStreamContainer => {
  const producer: HookProducer = {
    start(listener) {
      this.target = listener.next.bind(listener)
    },
    stop() {
      this.target = null
    },
    produce(...args: any[]) {
      if (this.target === null) return
      this.target(adapt(...args))
    }
  }
  return {
    stream: xs.create(producer),
    produce: producer.produce.bind(producer)
  }
}


export const createView = curriedN(2,
  (model: Model, viewfn: ViewFunction, propfn: Function = identity): View => {
    // Create the initial vnode
    let vnode: VNode = viewfn(model.data)

    // Update function
    const update = (data: any): void => {
      const newVnode = viewfn(data)
      newVnode.data = {...vnode.data.hooks}
      patch(vnode, newVnode)
      vnode = newVnode
    }

    model.subscribe(update)

    // Create hook streams
    const create = hookStream((emptyVnode: VNode, vnode: VNode) =>
      ({vnode}))
    const postpatch = hookStream((oldVnode: VNode, newVnode: VNode) =>
      ({old: oldVnode, new: newVnode}))
    const remove = hookStream((vnode: VNode, removeCallback: Function) =>
      ({vnode, callback: removeCallback}))

    // Instrument the vnode with hoooks
    vnode.data = {
      ...vnode.data,
      hoooks: {
        create: create.produce,
        postpatch: postpatch.produce,
        remove: remove.produce,
        destroy: () => model.unsubscribe(update)
      }
    }

    return {
      create$: create.stream,
      postpatch$: postpatch.stream,
      remove$: remove.stream,
      get vnode(): VNode {
        return vnode
      },
      renderInto(root: string): void {
        patch(document.querySelector(root), vnode)
      }
    }
  }
)


export interface View {
  create$: Stream<any>
  postpatch$: Stream<any>
  remove$: Stream<any>
  readonly vnode: VNode
}


export declare type ViewFunction = (data: any) => VNode


export declare type PropFunction = (data: any) => any


export interface HookProducer {
  target?: Function
  start(listener: Listener<any>): void
  stop(): void
  produce(...args: any[]): void
}


export interface HookStreamContainer {
  stream: Stream<any>
  produce: Function
}
