import { Uint8ArrayList } from 'uint8arraylist'
import defer from 'p-defer'
import type { Source } from 'it-stream-types'

const DEFAULT_BATCH_SIZE = 1024 * 1024
const DEFAULT_SERIALIZE = (buf: Uint8Array | Uint8ArrayList, list: Uint8ArrayList): void => { list.append(buf) }

export interface BatchedBytesOptions {
  /**
   * The minimum number of bytes that should be in a batch (default: 1MB)
   */
  size?: number

  /**
   * If this amount of time passes, yield all the bytes in the batch even
   * if they are below `size` (default: 0 - e.g. on every tick)
   */
  yieldAfter?: number
}

export interface BatchedOptions<T> {
  /**
   * The minimum number of bytes that should be in a batch (default: 1MB)
   */
  size?: number

  /**
   * If this amount of time passes, yield all the bytes in the batch even
   * if they are below `size` (default: 0 - e.g. on every tick)
   */
  yieldAfter?: number

  /**
   * If passed, this function should serialize the object and append the
   * result to the passed list
   */
  serialize: (object: T, list: Uint8ArrayList) => void
}

/**
 * Takes a stream of Uint8Arrays and/or Uint8ArrayLists and store them in
 * an internal buffer. Either once the buffer reaches the requested size
 * or the next event loop tick occurs, yield any bytes from the buffer.
 */
function batchedBytes (source: Source<Uint8Array | Uint8ArrayList>, options?: BatchedBytesOptions): Source<Uint8Array>
function batchedBytes <T> (source: Source<T>, options: BatchedOptions<T>): Source<Uint8Array>
async function * batchedBytes (source: Source<any>, options: any = {}): any {
  let buffer = new Uint8ArrayList()
  let ended = false
  let deferred = defer()

  let size = Number(options.size ?? DEFAULT_BATCH_SIZE)

  if (isNaN(size) || size === 0 || size < 0) {
    size = DEFAULT_BATCH_SIZE
  }

  const yieldAfter = options.yieldAfter ?? 0
  const serialize = options.serialize ?? DEFAULT_SERIALIZE

  void Promise.resolve().then(async () => {
    try {
      let timeout

      for await (const buf of source) {
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
}

export default batchedBytes
