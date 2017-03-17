import { Promise } from 'es6-promise'

interface Request {
  url: string,
  method?: string,
  data?: any,
  type?: string
}

export const request = ({url, method='GET', data={}, type = 'json'}: Request): Promise<any> =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.onload = () =>
      req.status === 200 ?
        type === 'json' ?
          resolve(JSON.parse(req.responseText))
          : resolve(req.responseText)
        : reject(req)
    req.onabort = req.ontimeout = req.onerror = () => reject(req)
    req.open(method, url)
    req.send(data)
  })
