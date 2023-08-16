/**
 * @packageDocumentation
 *
 * This module makes it easy to send and receive length-prefixed byte arrays over
 * streams.
 *
 * @example
 *
 * ```typescript
 * import { lpStream } from 'it-length-prefixed-stream'
 *
 * const stream = lpStream(duplex)
 *
 * // read the next length-prefixed chunk
 * const bytes = await stream.read()
 *
 * // write a length-prefixed chunk
 * await stream.write(Uint8Array.from([0, 1, 2, 3, 4]))
 * ```
 */

import { byteStream } from 'it-byte-stream'
import * as lp from 'it-length-prefixed'
import * as varint from 'uint8-varint'
import { Uint8ArrayList } from 'uint8arraylist'
import type { Duplex } from 'it-stream-types'

class CodeError extends Error {
  public readonly code: string

  constructor (message: string, code: string) {
    super(message)
    this.code = code
  }
}

export interface AbortOptions {
  signal?: AbortSignal
}

export interface LengthPrefixedStream <Stream = unknown> {
  /**
   * Read the next length-prefixed number of bytes from the stream
   */
  read: (options?: AbortOptions) => Promise<Uint8ArrayList>

  /**
   * Write the passed bytes to the stream prefixed by their length
   */
  write: (input: Uint8Array | Uint8ArrayList, options?: AbortOptions) => Promise<void>

  /**
   * Returns the underlying stream
   */
  unwrap: () => Stream
}

export interface LengthPrefixedStreamOpts {
  // encoding opts
  lengthEncoder: lp.LengthEncoderFunction

  // decoding opts
  lengthDecoder: lp.LengthDecoderFunction
  maxLengthLength: number
  maxDataLength: number
}

const defaultLengthDecoder: lp.LengthDecoderFunction = (buf) => {
  return varint.decode(buf)
}
defaultLengthDecoder.bytes = 0

export function lpStream <Stream extends Duplex<any, any, any>> (duplex: Stream, opts?: Partial<LengthPrefixedStreamOpts>): LengthPrefixedStream<Stream> {
  const bytes = byteStream(duplex)

  const W: LengthPrefixedStream<Stream> = {
    read: async (options?: AbortOptions) => {
      let dataLength: number = -1
      const lengthBuffer = new Uint8ArrayList()
      const decodeLength = opts?.lengthDecoder ?? defaultLengthDecoder

      while (true) {
        // read one byte at a time until we can decode a varint
        lengthBuffer.append(await bytes.read(1, options))

        try {
          dataLength = decodeLength(lengthBuffer)
        } catch (err) {
          if (err instanceof RangeError) {
            continue
          }

          throw err
        }

        if (dataLength > -1) {
          break
        }

        if (opts?.maxLengthLength != null && lengthBuffer.byteLength > opts.maxLengthLength) {
          throw new CodeError('message length length too long', 'ERR_MSG_LENGTH_TOO_LONG')
        }
      }

      if (opts?.maxDataLength != null && dataLength > opts.maxDataLength) {
        throw new CodeError('message length too long', 'ERR_MSG_DATA_TOO_LONG')
      }

      return bytes.read(dataLength, options)
    },
    write: async (data, options?: AbortOptions) => {
      // encode, write
      await bytes.write(lp.encode.single(data, opts), options)
    },
    unwrap: () => {
      return bytes.unwrap()
    }
  }

  return W
}
