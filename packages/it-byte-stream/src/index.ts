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

import { queuelessPushable } from 'it-queueless-pushable'
import { raceSignal } from 'race-signal'
import { Uint8ArrayList } from 'uint8arraylist'
import { UnexpectedEOFError } from './errors.js'
import type { AbortOptions } from 'abort-error'
import type { Duplex } from 'it-stream-types'

export interface ReadOptions extends AbortOptions {
  bytes: number
}

export interface ByteStream <Stream = unknown> {
  /**
   * Read bytes from the stream.
   *
   * If a required number of bytes is passed as an option, this will wait for
   * the underlying stream to supply that number of bytes, throwing an
   * `UnexpectedEOFError` if the stream closes before this happens.
   *
   * If no required number of bytes is passed, this will return `null` if the
   * underlying stream closes before supplying any bytes.
   */
  read(options: ReadOptions): Promise<Uint8ArrayList>
  read(options?: AbortOptions): Promise<Uint8ArrayList | null>

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
  const write = queuelessPushable()

  duplex.sink(write).catch(async (err: Error) => {
    await write.end(err)
  })

  duplex.sink = async (source: any) => {
    for await (const buf of source) {
      await write.push(buf)
    }

    await write.end()
  }

  let source: AsyncGenerator<any> = duplex.source

  if (duplex.source[Symbol.iterator] != null) {
    source = duplex.source[Symbol.iterator]()
  } else if (duplex.source[Symbol.asyncIterator] != null) {
    source = duplex.source[Symbol.asyncIterator]()
  }

  const readBuffer = new Uint8ArrayList()

  const W: ByteStream<Stream> = {
    read: async (options?: ReadOptions) => {
      options?.signal?.throwIfAborted()

      if (options?.bytes == null) {
        // just read whatever arrives
        const { done, value } = await raceSignal(source.next(), options?.signal)

        if (done === true) {
          return null
        }

        return value
      }

      while (readBuffer.byteLength < options.bytes) {
        const { value, done } = await raceSignal(source.next(), options?.signal)

        if (done === true) {
          throw new UnexpectedEOFError('unexpected end of input')
        }

        readBuffer.append(value)
      }

      const buf = readBuffer.sublist(0, options.bytes)
      readBuffer.consume(options.bytes)

      return buf
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
