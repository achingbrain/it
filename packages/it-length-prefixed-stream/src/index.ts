/**
 * @packageDocumentation
 *
 * This module makes it easy to send and receive length-prefixed byte arrays over streams.
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
 *
 * // write several chunks, all individually length-prefixed
 * await stream.writeV([
 *   Uint8Array.from([0, 1, 2, 3, 4]),
 *   Uint8Array.from([5, 6, 7, 8, 9])
 * ])
 * ```
 */
import { byteStream } from 'it-byte-stream'
import * as varint from 'uint8-varint'
import { Uint8ArrayList } from 'uint8arraylist'
import { InvalidDataLengthError, InvalidDataLengthLengthError, InvalidMessageLengthError } from './errors.js'
import type { AbortOptions } from 'abort-error'
import type { ByteStreamOpts } from 'it-byte-stream'
import type { Duplex } from 'it-stream-types'

export interface LengthPrefixedStream <Stream = unknown> {
  /**
   * Read the next length-prefixed number of bytes from the stream
   */
  read(options?: AbortOptions): Promise<Uint8ArrayList>

  /**
   * Write the passed bytes to the stream prefixed by their length
   */
  write(input: Uint8Array | Uint8ArrayList, options?: AbortOptions): Promise<void>

  /**
   * Write passed list of bytes, prefix by their individual lengths to the stream as a single write
   */
  writeV(input: Array<Uint8Array | Uint8ArrayList>, options?: AbortOptions): Promise<void>

  /**
   * Returns the underlying stream
   */
  unwrap(): Stream
}

export interface LengthPrefixedStreamOpts extends ByteStreamOpts {
  // encoding opts
  lengthEncoder (value: number): Uint8ArrayList | Uint8Array

  // decoding opts
  lengthDecoder (data: Uint8ArrayList): number
  maxLengthLength: number
  maxDataLength: number
}

export function lpStream <Stream extends Duplex<any, any, any>> (duplex: Stream, opts: Partial<LengthPrefixedStreamOpts> = {}): LengthPrefixedStream<Stream> {
  const bytes = byteStream(duplex, opts)

  if (opts.maxDataLength != null && opts.maxLengthLength == null) {
    // if max data length is set but max length length is not, calculate the
    // max length length needed to encode max data length
    opts.maxLengthLength = varint.encodingLength(opts.maxDataLength)
  }

  const decodeLength = opts?.lengthDecoder ?? varint.decode
  const encodeLength = opts?.lengthEncoder ?? varint.encode

  const W: LengthPrefixedStream<Stream> = {
    read: async (options?: AbortOptions) => {
      let dataLength: number = -1
      const lengthBuffer = new Uint8ArrayList()

      while (true) {
        // read one byte at a time until we can decode a varint
        lengthBuffer.append(await bytes.read({
          ...options,
          bytes: 1
        }))

        try {
          dataLength = decodeLength(lengthBuffer)
        } catch (err) {
          if (err instanceof RangeError) {
            continue
          }

          throw err
        }

        if (dataLength < 0) {
          throw new InvalidMessageLengthError('Invalid message length')
        }

        if (opts?.maxLengthLength != null && lengthBuffer.byteLength > opts.maxLengthLength) {
          throw new InvalidDataLengthLengthError('message length length too long')
        }

        if (dataLength > -1) {
          break
        }
      }

      if (opts?.maxDataLength != null && dataLength > opts.maxDataLength) {
        throw new InvalidDataLengthError('message length too long')
      }

      return bytes.read({
        ...options,
        bytes: dataLength
      })
    },
    write: async (data, options?: AbortOptions) => {
      // encode, write
      await bytes.write(new Uint8ArrayList(encodeLength(data.byteLength), data), options)
    },
    writeV: async (data, options?: AbortOptions) => {
      const list = new Uint8ArrayList(
        ...data.flatMap(buf => ([encodeLength(buf.byteLength), buf]))
      )

      // encode, write
      await bytes.write(list, options)
    },
    unwrap: () => {
      return bytes.unwrap()
    }
  }

  return W
}
