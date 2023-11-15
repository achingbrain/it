/**
 * @packageDocumentation
 *
 * Lets you look at the contents of an async iterator and decide what to do
 *
 * @example
 *
 * ```javascript
 * import peekable from 'it-peekable'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const it = peekable(value)
 *
 * const first = it.peek()
 *
 * console.info(first) // 0
 *
 * it.push(first)
 *
 * console.info([...it])
 * // [ 0, 1, 2, 3, 4 ]
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import peekable from 'it-peekable'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const it = peekable(values())
 *
 * const first = await it.peek()
 *
 * console.info(first) // 0
 *
 * it.push(first)
 *
 * console.info(await all(it))
 * // [ 0, 1, 2, 3, 4 ]
 * ```
 */

export interface Peek <T> {
  peek(): IteratorResult<T, undefined>
}

export interface AsyncPeek <T> {
  peek(): Promise<IteratorResult<T, undefined>>
}

export interface Push <T> {
  push(value: T): void
}

export type Peekable <T> = Iterable<T> & Peek<T> & Push<T> & Iterator<T>

export type AsyncPeekable <T> = AsyncIterable<T> & AsyncPeek<T> & Push<T> & AsyncIterator<T>

function peekable <T> (iterable: Iterable<T>): Peekable<T>
function peekable <T> (iterable: AsyncIterable<T>): AsyncPeekable<T>
function peekable <T> (iterable: Iterable<T> | AsyncIterable<T>): Peekable<T> | AsyncPeekable<T> {
  // @ts-expect-error can't use Symbol.asyncIterator to index iterable since it might be Iterable
  const [iterator, symbol] = iterable[Symbol.asyncIterator] != null
    // @ts-expect-error can't use Symbol.asyncIterator to index iterable since it might be Iterable
    ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator]
    // @ts-expect-error can't use Symbol.iterator to index iterable since it might be AsyncIterable
    : [iterable[Symbol.iterator](), Symbol.iterator]

  const queue: any[] = []

  // @ts-expect-error can't use symbol to index peekable
  return {
    peek: () => {
      return iterator.next()
    },
    push: (value: any) => {
      queue.push(value)
    },
    next: () => {
      if (queue.length > 0) {
        return {
          done: false,
          value: queue.shift()
        }
      }

      return iterator.next()
    },
    [symbol] () {
      return this
    }
  }
}

export default peekable
