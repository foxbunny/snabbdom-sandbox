/**
 * This code is a modified version of the code found on Ben Walsh's blog:
 *
 * https://davidwalsh.name/element-matches-selector
 */

const eproto = Element.prototype;

const fallbackMatchesSelector = function (selector: string) {
  [].indexOf.call(document.querySelectorAll(selector), this) !== -1
}

const matchFn = eproto.matches ||
  eproto.webkitMatchesSelector ||
  eproto.msMatchesSelector ||
  fallbackMatchesSelector

export const matches = (selector: string, el: (Element | EventTarget)) =>
  matchFn.call(el, selector)

export const targetMatches = (selector: string) => (ev: Event) =>
  matches(selector, ev.target)
