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
