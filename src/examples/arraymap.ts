import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import xs from 'xstream'
import { path, sortBy, prop, always } from 'ramda'

import { ProgramInput, createProgram } from '../emvy/starter'
import { request } from '../emvy/xhr'
import html from '../emvy/html'


const { div, h2, p, a, button } = html


export const user = (user: any): VNode =>
  div('.user', [
    h2(user.name),
    p(a({ props: { href: 'mailto:' + user.email } }, 'email'))
  ])


export const modelView = (data: any): VNode => {
  const users = data.sort === 'name' ?
    sortBy(prop('name'), data.users)
    : data.users
  return (
    div([
      p([
        button('.load', 'Load users'),
        button('.clear', 'Clear'),
        button('.sort', data.sort === 'name' ? 'Unsort' : 'Sort by name')
      ]),
      div(users.map(user))
    ])
  )
}


export const eventModel = (input: ProgramInput) => {
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


export const program = createProgram(modelView, eventModel)


export const init = {users: [], selected: null} as UsersModel


export interface UsersModel {
  users: any[]
  selected: string | null
}
