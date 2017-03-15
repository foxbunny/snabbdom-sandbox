import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import always = require('ramda/src/always')
import xs from 'xstream'

import { start } from './starter'
import { program } from './hello'

start(program, '#app', {name: 'World'})
