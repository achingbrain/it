import defer from 'p-defer'
import { Uint8ArrayList } from 'uint8arraylist'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

const DEFAULT_BATCH_SIZE = 1024 * 1024
const DEFAULT_SERIALIZE = (buf: Uint8Array | Uint8ArrayList, list: Uint8ArrayList): void => { list.append(buf) }

export interface BatchedBytesOptions {
  /**
   * The minimum number of bytes that should be in a batch (default: 1MB)
   */
  size?: number
}

export interface AsyncBatchedBytesOptions extends BatchedBytesOptions {
  /**
   * If this amount of time passes, yield all the bytes in the batch even
   * if they are below `size` (default: 0 - e.g. on every tick)
   */
  yieldAfter?: number
}

export interface BatchedObjectsOptions<T> extends BatchedBytesOptions {
  /**
   * This function should serialize the object and append the
   * result to the passed list
   */
  serialize: (object: T, list: Uint8ArrayList) => void
}

export interface AsyncBatchedObjectsOptions<T> extends AsyncBatchedBytesOptions, BatchedObjectsOptions<T> {

}

/**
 * Takes a stream of Uint8Arrays and/or Uint8ArrayLists and store them in
 * an internal buffer. Either once the buffer reaches the requested size
 * or the next event loop tick occurs, yield any bytes from the buffer.
 */
function batchedBytes (source: Iterable<Uint8Array | Uint8ArrayList>, options?: BatchedBytesOptions): Iterable<Uint8Array>
function batchedBytes (source: Iterable<Uint8Array | Uint8ArrayList> | AsyncIterable<Uint8Array | Uint8ArrayList>, options?: AsyncBatchedBytesOptions): AsyncIterable<Uint8Array>
function batchedBytes <T> (source: Iterable<T>, options?: BatchedObjectsOptions<T>): Iterable<Uint8Array>
function batchedBytes <T> (source: Iterable<T> | AsyncIterable<T>, options?: AsyncBatchedObjectsOptions<T>): AsyncIterable<Uint8Array>
function batchedBytes <T = Uint8Array | Uint8ArrayList> (source: Iterable<T> | AsyncIterable<T>, options?: Partial<AsyncBatchedObjectsOptions<T>>): AsyncIterable<Uint8Array> | Iterable<Uint8Array> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      let buffer = new Uint8ArrayList()
      let ended = false
      let deferred = defer()

      let size = Number(options?.size ?? DEFAULT_BATCH_SIZE)

      if (isNaN(size) || size === 0 || size < 0) {
        size = DEFAULT_BATCH_SIZE
      }

      if (size !== Math.round(size)) {
        throw new Error('Batch size must be an integer')
      }

      const yieldAfter = options?.yieldAfter ?? 0
      const serialize = options?.serialize ?? DEFAULT_SERIALIZE

      void Promise.resolve().then(async () => {
        try {
          let timeout

          for await (const buf of source) {
            // @ts-expect-error - if buf is not `Uint8Array | Uint8ArrayList` we cannot use the default serializer
            serialize(buf, buffer)

            if (buffer.byteLength >= size) {
              clearTimeout(timeout)
              deferred.resolve()
              continue
            }

            timeout = setTimeout(() => { // eslint-disable-line no-loop-func
              deferred.resolve()
            }, yieldAfter)
          }

          clearTimeout(timeout)
          deferred.resolve()
        } catch (err) {
          deferred.reject(err)
        } finally {
          ended = true
        }
      })

      while (!ended) { // eslint-disable-line no-unmodified-loop-condition
        await deferred.promise
        deferred = defer()
        if (buffer.byteLength > 0) {
          const b = buffer
          buffer = new Uint8ArrayList()
          yield b.subarray()
        }
      }
    })()
  }

  return (function * () {
    const buffer = new Uint8ArrayList()
    let size = Number(options?.size ?? DEFAULT_BATCH_SIZE)

    if (isNaN(size) || size === 0 || size < 0) {
      size = DEFAULT_BATCH_SIZE
    }

    if (size !== Math.round(size)) {
      throw new Error('Batch size must be an integer')
    }

    const serialize = options?.serialize ?? DEFAULT_SERIALIZE

    for (const buf of source) {
      // @ts-expect-error - if buf is not `Uint8Array | Uint8ArrayList` we cannot use the default serializer
      serialize(buf, buffer)

      if (buffer.byteLength >= size) {
        yield buffer.subarray(0, size)
        buffer.consume(size)
      }
    }

    if (buffer.byteLength > 0) {
      yield buffer.subarray()
    }
  })()
}

export default batchedBytes
