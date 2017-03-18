import * as util from './index'

test('util.init will return all array items except last', () => {
  expect(util.init([1, 2, 3])).toEqual([1, 2])
})

test('util.init will return empty array if array length is 1', () => {
  expect(util.init([1])).toEqual([])
})

test('util.init will return empty array if input is empty', () => {
  expect(util.init([])).toEqual([])
})

test('util.last will return the last element of an array', () => {
  expect(util.last([1, 2, 3])).toBe(3)
})

test('util.last will return the first element if array length is 1', () => {
  expect(util.last([1])).toBe(1)
})

test('util.last will return undefined if array is empty', () => {
  expect(util.last([])).toBe(undefined)
})

test('util.reversed will return a reversed copy of an array', () => {
  expect(util.reversed([1, 2, 3])).toEqual([3, 2, 1])
})

test('util.reversed will return an empty array if input is empty', () => {
  expect(util.reversed([])).toEqual([])
})

test('util.compose will compose functions right-to-left', () => {
  const fn1 = (x: number): number => x + 1
  const fn2 = (x: number): number => x / 2
  const fn3 = (x: number): number => x * 1.5
  const c1 = util.compose(fn1, fn2, fn3)
  const c2 = util.compose(fn3, fn2, fn1)
  expect(c1(3)).toBe(3.25)
  expect(c2(3)).toBe(3)
})

test('util.compose output will behave like a normal function if only one fn is supplied', () => {
  const fn = (x: number): number => x + 1
  const c1 = util.compose(fn)
  expect(c1(3)).toBe(4)
})

test('util.pipe will compose functions left-to-right', () => {
  const fn1 = (x: number): number => x + 1
  const fn2 = (x: number): number => x / 2
  const fn3 = (x: number): number => x * 1.5
  const c1 = util.pipe(fn1, fn2, fn3)
  const c2 = util.pipe(fn3, fn2, fn1)
  expect(c1(3)).toBe(3)
  expect(c2(3)).toBe(3.25)
})

test('util.pipe output will behave like a normal function if only one fn is supplied', () => {
  const fn = (x: number): number => x + 1
  const c1 = util.pipe(fn)
  expect(c1(3)).toBe(4)
})

test('util.always returns a function that always evaluates to same value', () => {
  const fn = util.always(true)
  expect(fn()).toBe(true)
  expect(fn(2)).toBe(true)
  expect(fn(12)).toBe(true)
})

test('util.memoized will memoize an unary function', () => {
  let count = 0
  const fn = (x: any) => {
    count += 1
    return x * x
  }
  const memoized = util.memoized(fn)
  expect(memoized(2)).toBe(4)
  expect(count).toBe(1)
  expect(memoized(2)).toBe(4)
  expect(count).toBe(1)
  expect(memoized(4)).toBe(16)
  expect(count).toBe(2)
  expect(memoized(4)).toBe(16)
  expect(count).toBe(2)
})
