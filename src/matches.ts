/**
 * This code is a modified version of the code found on Ben Walsh's blog:
 *
 * https://davidwalsh.name/element-matches-selector
 */

import curry = require('ramda/src/curry')

const eproto = Element.prototype;

const fallbackMatchesSelector = function (selector: string) {
  [].indexOf.call(document.querySelectorAll(selector), this) !== -1
}

const matchFn = eproto.matches ||
  eproto.webkitMatchesSelector ||
  eproto.msMatchesSelector ||
  fallbackMatchesSelector

export const matches = curry((selector: string, el: (Element | EventTarget)) =>
  matchFn.call(el, selector)
)

export const targetMatches = curry((selector: string, ev: Event) =>
  matches(selector, ev.target)
)
