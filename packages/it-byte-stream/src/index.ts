/**
 * @packageDocumentation
 *
 * This module makes it easy to send and receive bytes over streams.
 *
 * @example
 *
 * ```typescript
 * import { byteStream } from 'it-byte-stream'
 *
 * const stream = byteStream(duplex)
 *
 * // read the next chunk
 * const bytes = await stream.read()
 *
 * // read the next five bytes
 * const fiveBytes = await stream.read(5)
 *
 * // write bytes into the stream
 * await stream.write(Uint8Array.from([0, 1, 2, 3, 4]))
 * ```
 */

import { Uint8ArrayList } from 'uint8arraylist'
import { pushable } from './pushable.js'
import type { Duplex } from 'it-stream-types'

export class CodeError extends Error {
  public readonly code: string

  constructor (message: string, code: string) {
    super(message)
    this.code = code
  }
}

export class AbortError extends CodeError {
  public readonly type: string

  constructor (message: string) {
    super(message, 'ABORT_ERR')
    this.type = 'aborted'
  }
}

export interface AbortOptions {
  signal?: AbortSignal
}

export interface ByteStream <Stream = unknown> {
  /**
   * Read a set number of bytes from the stream
   */
  read(bytes?: number, options?: AbortOptions): Promise<Uint8ArrayList>

  /**
   * Write the passed bytes to the stream
   */
  write(input: Uint8Array | Uint8ArrayList, options?: AbortOptions): Promise<void>

  /**
   * Returns the underlying stream
   */
  unwrap(): Stream
}

export interface ByteStreamOpts {
  /**
   * After the stream is unwrapped, any bytes that have been read from the
   * incoming stream will be yielded in-order as `Uint8Array`(s).
   *
   * To yield a single `Uint8ArrayList` with all unread bytes instead, pass
   * `false` here.
   */
  yieldBytes?: boolean
}

export function byteStream <Stream extends Duplex<any, any, any>> (duplex: Stream, opts?: ByteStreamOpts): ByteStream<Stream> {
  const write = pushable()

  duplex.sink(write).catch(async (err: Error) => {
    await write.end(err)
  })

  duplex.sink = async (source: any) => {
    for await (const buf of source) {
      await write.push(buf)
    }

    await write.end()
  }

  let source = duplex.source

  if (duplex.source[Symbol.iterator] != null) {
    source = duplex.source[Symbol.iterator]()
  } else if (duplex.source[Symbol.asyncIterator] != null) {
    source = duplex.source[Symbol.asyncIterator]()
  }

  const readBuffer = new Uint8ArrayList()

  const W: ByteStream<Stream> = {
    read: async (bytes?: number, options?: AbortOptions) => {
      options?.signal?.throwIfAborted()

      let listener: EventListener | undefined

      const abortPromise = new Promise((resolve, reject) => {
        listener = () => {
          reject(new AbortError('Read aborted'))
        }

        options?.signal?.addEventListener('abort', listener)
      })

      try {
        if (bytes == null) {
          // just read whatever arrives
          const { done, value } = await Promise.race([
            source.next(),
            abortPromise
          ])

          if (done === true) {
            return new Uint8ArrayList()
          }

          return value
        }

        while (readBuffer.byteLength < bytes) {
          const { value, done } = await Promise.race([
            source.next(),
            abortPromise
          ])

          if (done === true) {
            throw new CodeError('unexpected end of input', 'ERR_UNEXPECTED_EOF')
          }

          readBuffer.append(value)
        }

        const buf = readBuffer.sublist(0, bytes)
        readBuffer.consume(bytes)

        return buf
      } finally {
        if (listener != null) {
          options?.signal?.removeEventListener('abort', listener)
        }
      }
    },
    write: async (data, options?: AbortOptions) => {
      options?.signal?.throwIfAborted()

      // just write
      if (data instanceof Uint8Array) {
        await write.push(data, options)
      } else {
        await write.push(data.subarray(), options)
      }
    },
    unwrap: () => {
      if (readBuffer.byteLength > 0) {
        const originalStream = duplex.source
        duplex.source = (async function * () {
          if (opts?.yieldBytes === false) {
            yield readBuffer
          } else {
            yield * readBuffer
          }

          yield * originalStream
        }())
      }

      return duplex
    }
  }

  return W
}
