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

/**
 * Create a `ByteStream` that is useful for working with streams of bytes.
 * Streams can consume bytes at a different rate than the source of
 * bytes is producing them, so the `ByteStream` buffers incoming bytes until
 * they can be consumed,and buffers outgoing bytes and yields them as
 * requested in order to create some "temporal slack".
 *
 * `byteStream` acheives this by "disassembling" the duplex stream into its
 * constituent parts and then reassembling them into a `ByteStream`
 * that provides a simple API for reading and writing bytes, while also
 * intergrating the buffering logic needed to handle the rate mismatch.
 *
 * The buffering to and from the `Duplex` stream is done using a
 * `Uint8ArrayList` to buffer bytes that are being read, and a `pushable`
 * to buffer outgoing bytes
 *
 * This disassembly and reassembly is "reversible", such that a stream
 * equivalent to the original duplex stream can be reconstructed using the
 * `unwrap` method.
 */
export function byteStream <Stream extends Duplex<any, any, any>> (duplex: Stream, opts?: ByteStreamOpts): ByteStream<Stream> {
  // 1. The duplex may consume bytes at a different rate than the source
  // of bytes is producing them. To handle this, incoming bytes are
  // buffered in a pushable and yield them as requested.

  // 1.1. Create a pushable to buffer incoming bytes
  const write = pushable()

  // 1.2. Make the duplex read from the pushable
  duplex.sink(write).catch(async (err: Error) => {
    await write.end(err)
  })

  // 1.3. Intercept any source subsequetly passed to the stream and redirect
  // its contents to the pushable where the duplex is actually reading
  // from. This is neccesary if the duplex is unwrapped and; for example.
  duplex.sink = async (source: any) => {
    for await (const buf of source) {
      await write.push(buf)
    }

    await write.end()
  }

  // 2. The source of bytes can be an iterable, an async iterable, an iterator, or a
  // an async iterator. To handle this, the source is normalized to an async
  // iterator; even if the underlying source is synchronous.

  // 2.1. Assume the source is an async iterator
  let source = duplex.source

  // 2.2. If the source is an iterable, convert it to an async iterator
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
