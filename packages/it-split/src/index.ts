/**
 * @packageDocumentation
 *
 * Searches `Uint8Array`s emitted by an (async)iterable for a delimiter and yields chunks split by that delimiter.
 *
 * @example
 *
 * ```javascript
 * import split from 'it-split'
 *
 * const encoder = new TextEncoder()
 *
 * // This can also be an iterator, generator, etc
 * const values = [
 *   encoder.encode('hello\nwor'),
 *   encoder.encode('ld')
 * ]
 *
 * const arr = all(split(values))
 *
 * console.info(arr) // [encoder.encode('hello'), encoder.encode('world')]
 * ```
 *
 * You can also split by arbitrary delimiters:
 *
 * ```javascript
 * const values = [
 *   Uint8Array.from([0, 1, 2, 3]),
 *   Uint8Array.from([0, 1, 2, 3]),
 *   Uint8Array.from([1, 1, 2])
 * ]
 * const delimiter = Uint8Array.from([1, 2])
 *
 * const arr = all(split(values, {
 *   delimiter
 * }))
 *
 * console.info(arr) // [ Buffer.from([0]), Buffer.from([3, 0]), Buffer.from([3, 1]) ]
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import split from 'it-split'
 *
 * const encoder = new TextEncoder()
 *
 * const values = async function * () {
 *   yield * [
 *     encoder.encode('hello\nwor'),
 *     encoder.encode('ld')
 *   ]
 * }
 *
 * const arr = await all(split(values()))
 *
 * console.info(arr) // [encoder.encode('hello'), encoder.encode('world')]
 * ```
 */

import { Uint8ArrayList } from 'uint8arraylist'

export interface SplitOptions {
  delimiter?: Uint8Array
}

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Splits Uint8Arrays emitted by an (async) iterable by a delimiter
 */
function split (source: Iterable<Uint8Array>, options?: SplitOptions): Generator<Uint8Array, void, undefined>
function split (source: Iterable<Uint8Array> | AsyncIterable<Uint8Array>, options?: SplitOptions): AsyncGenerator<Uint8Array, void, undefined>
function split (source: Iterable<Uint8Array> | AsyncIterable<Uint8Array>, options: SplitOptions = {}): AsyncGenerator<Uint8Array, void, undefined> | Generator<Uint8Array, void, undefined> {
  const bl = new Uint8ArrayList()
  const delimiter = options.delimiter ?? new TextEncoder().encode('\n')

  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const buf of source) {
        bl.append(buf)

        yield * yieldUntilEnd(bl, delimiter)
      }

      yield * yieldUntilEnd(bl, delimiter)

      if (bl.length > 0) {
        yield bl.slice()
      }
    })()
  }

  return (function * () {
    for (const buf of source) {
      bl.append(buf)

      yield * yieldUntilEnd(bl, delimiter)
    }

    yield * yieldUntilEnd(bl, delimiter)

    if (bl.length > 0) {
      yield bl.slice()
    }
  })()
}

function * yieldUntilEnd (bl: Uint8ArrayList, delimiter: Uint8Array): Generator<Uint8Array, void, undefined> {
  let index = bl.indexOf(delimiter)

  while (index !== -1) {
    yield bl.slice(0, index)

    bl.consume(index + delimiter.length)

    index = bl.indexOf(delimiter)
  }
}

export default split
