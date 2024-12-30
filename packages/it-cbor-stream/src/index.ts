/**
 * @packageDocumentation
 *
 * This module makes it easy to send and receive length-prefixed CBOR encoded
 * messages over streams.
 *
 * @example
 *
 * ```typescript
 * import { cborStream } from 'it-cbor-stream'
 * import { MessageType } from './src/my-message-type.js'
 *
 * const stream = cborStream(duplex)
 *
 * // write a message to the stream
 * stream.write({
 *   foo: 'bar'
 * })
 *
 * // read a message from the stream
 * const res = await stream.read()
 * ```
 */

import { encode, decode } from 'cborg'
import { lpStream } from 'it-length-prefixed-stream'
import type { EncodeOptions, DecodeOptions } from 'cborg/interface'
import type { LengthPrefixedStreamOpts } from 'it-length-prefixed-stream'
import type { Duplex } from 'it-stream-types'

export interface AbortOptions {
  signal?: AbortSignal
}

/**
 * Convenience methods for working with CBOR streams
 */
export interface CBORStream <Stream = unknown> {
  /**
   * Read the next length-prefixed byte array from the stream and decode it as CBOR
   */
  read<T>(options?: AbortOptions): Promise<T>

  /**
   * Encode the passed object as a CBOR message and write it's length-prefixed bytes to the stream
   */
  write<T>(data: T, options?: AbortOptions): Promise<void>

  /**
   * Encode the passed objects as CBOR messages and write their length-prefixed bytes to the stream as a single write
   */
  writeV<T>(input: T[], options?: AbortOptions): Promise<void>

  /**
   * Returns the underlying stream
   */
  unwrap(): Stream
}

export function cborStream <Stream extends Duplex<any, any, any>> (duplex: Stream, opts?: LengthPrefixedStreamOpts): CBORStream<Stream> {
  const lp = lpStream(duplex, opts)

  const W: CBORStream<Stream> = {
    read: async (options?: AbortOptions & DecodeOptions) => {
      // readLP, decode
      const value = await lp.read(options)

      return decode(value.subarray(), options)
    },
    write: async (message, options?: AbortOptions & EncodeOptions) => {
      // encode, writeLP
      await lp.write(encode(message, options), options)
    },
    writeV: async (messages, options?: AbortOptions & EncodeOptions) => {
      // encode, writeLP
      await lp.writeV(messages.map(message => encode(message, options)), options)
    },
    unwrap: () => {
      return lp.unwrap()
    }
  }

  return W
}
