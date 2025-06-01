/**
 * @packageDocumentation
 *
 * Mostly useful for tests or when you want to be explicit about consuming an iterable without doing anything with any yielded values.
 *
 * @example
 *
 * ```javascript
 * import drain from 'it-drain'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * drain(values)
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import drain from 'it-drain'
 *
 * const values = async function * {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * await drain(values())
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Drains an (async) iterable discarding its' content and does not return
 * anything
 */
function drain (source: Iterable<unknown>): void
function drain (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<void>
function drain (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<void> | void {
  if (isAsyncIterable(source)) {
    return (async () => {
      for await (const _ of source) { } // eslint-disable-line no-empty,@typescript-eslint/no-unused-vars
    })()
  } else {
    for (const _ of source) { } // eslint-disable-line no-empty,@typescript-eslint/no-unused-vars
  }
}

export default drain
