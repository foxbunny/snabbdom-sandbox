import { Promise } from 'bluebird'
import pipe = require('ramda/src/pipe')
import toPairs = require('ramda/src/toPairs')
import map = require('ramda/src/map')
import join = require('ramda/src/join')
import identity = require('ramda/src/identity')
import useWith = require('ramda/src/useWith')

interface Request {
  url: string,
  method?: string,
  data?: any,
  type?: string
}

export const request = ({url, method='GET', data={}, type='json'}: Request): Promise =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.onload = () => {
      if (req.status === 200) {
        if (type === 'json') {
          try {
            resolve(JSON.parse(req.responseText))
          }
          catch (e) {
            reject(req)
          }
        }
        else {
          resolve(req.responseText)
        }
      }
      else {
        reject(req)
      }
    }
    req.onabort = req.ontimeout = req.onerror = () => {
      reject(req)
    }
    req.open(method, url)
    req.send(data)
  })
