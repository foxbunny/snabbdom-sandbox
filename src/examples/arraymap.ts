import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs from 'xstream'
import * as invoker from 'ramda/src/invoker'
import * as path from 'ramda/src/path'
import * as sortBy from 'ramda/src/sortBy'
import * as prop from 'ramda/src/prop'
import * as always from 'ramda/src/always'

import { ProgramOutput } from '../emvy/starter'
import { request } from '../emvy/xhr'

import { program as user } from './user'

const then = invoker(1, 'then')

export const view = (input) => (data): VNode => {
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

export const updates = (input) => {
  const load$ = input.on('click', '.load')
    .map(() =>
      request({url: 'http://jsonplaceholder.typicode.com/users'})
        .then(users => data => ({...data, users}))
    )
  const clear$ = input.on('click', '.clear')
    .map(always(data => ({...data, users: []})))
  const sort$ = input.on('click', '.sort')
    .map(always(data => ({...data, sort: data.sort === 'name' ? null : 'name'})))
  return xs.merge(load$, clear$, sort$)
}

export const program = (input) => {
  return {
    updates: updates(input),
    view: input.createView(view(input))
  } as ProgramOutput
}

export const init = {users: [], selected: null}
