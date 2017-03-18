/**
 * Returns a copy of an array excluding the last item
 *
 * The input array is not modified
 *
 * @param x {Array}
 */
export const init = (x: any[]): any[] =>
  x.slice(0, x.length - 1)

/**
 * Returns the last item of an array
 *
 * @param x {Array}
 */
export const last = (x: any[]): any[] =>
  x[x.length - 1]

/**
 * Returns a copy of an array with elements in reverse order
 *
 * The input array is not modified.
 *
 * Example:
 *
 *     reversed([1, 2, 3]) => [3, 2, 1]
 *
 * @param x {Array}
 */
export const reversed = (x: any[]): any[] =>
  x.length ?
    [last(x)].concat(reversed(init(x)))
    : []

/**
 * Performs right-to-left function composition
 *
 * @param ...fns {Function}
 */
export const compose = (...fns: Function[]): Function =>
  fns.reduce((f, g) => (...args: any[]) => f(g(...args)))

/**
 * Performs left-to-right function composition
 *
 * @param ...fns {Function}
 */
export const pipe = (...fns: Function[]): Function =>
  fns.reduce((f, g) => (...args: any[]) => g(f(...args)))

/**
 * Returns a function that always evaluates to the same value
 *
 * Note that the value is evaluated during the call to always(), so this is
 * not the same as using anonymous functions.
 */
export const always = (x: any) => (...any: any[]) => x
