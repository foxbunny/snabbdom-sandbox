import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs from 'xstream'
import { path, sortBy, prop, always } from 'ramda'

import { ProgramInput, Program } from '../emvy/starter'
import { mapView, SimpleOutput } from '../emvy/view'
import { request } from '../emvy/xhr'

import { program as user } from './user'

export const view = (input: ProgramInput) => (data: any): VNode => {
  let users: {}[]
  if (data.sort === 'name') {
    users = sortBy(prop('name'), data.users)
  }
  else {
    users = data.users
  }
  return (
    h('div', [
      h('p', [
        h('button.load', 'Load users'),
        h('button.clear', 'Clear'),
        h('button.sort', data.sort === 'name' ? 'Unsort' : 'Sort by name')
      ]),
      h('div', users
        .map(u => user({...input, props: {user: u}}))
        .map(path(['view', 'vnodes']))
      )
    ])
  )
}

export const updates = (input: ProgramInput) => {
  const load$ = input.on('click', '.load')
    .map(() =>
      request({url: 'http://jsonplaceholder.typicode.com/users'})
        .then((users) => (data: any): any => ({...data, users}))
    )
  const clear$ = input.on('click', '.clear')
    .map(always((data: any): any => ({...data, users: []})))
  const sort$ = input.on('click', '.sort')
    .map(always((data: any): any => ({...data, sort: data.sort === 'name' ? null : 'name'})))
  return xs.merge(load$, clear$, sort$)
}

export const program: Program = mapView((input: ProgramInput): SimpleOutput => {
  return {
    updates: updates(input),
    view: view(input)
  } as SimpleOutput
})

export interface UsersModel {
  users: any[]
  selected: string | null
}

export const init: UsersModel = {users: [], selected: null}
