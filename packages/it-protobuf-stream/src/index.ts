/**
 * @packageDocumentation
 *
 * This module makes it easy to send and receive length-prefixed Protobuf encoded
 * messages over streams.
 *
 * @example
 *
 * ```typescript
 * import { pbStream } from 'it-protobuf-stream'
 * import { MessageType } from './src/my-message-type.js'
 *
 * // RequestType and ResponseType have been generate from `.proto` files and have
 * // `.encode` and `.decode` methods for serialization/deserialization
 *
 * const stream = pbStream(duplex)
 *
 * // write a message to the stream
 * stream.write({
 *   foo: 'bar'
 * }, MessageType)
 *
 * // read a message from the stream
 * const res = await stream.read(MessageType)
 * ```
 */

import { lpStream } from 'it-length-prefixed-stream'
import type { AbortOptions } from 'abort-error'
import type { LengthPrefixedStreamOpts } from 'it-length-prefixed-stream'
import type { Duplex } from 'it-stream-types'
import type { Uint8ArrayList } from 'uint8arraylist'

/**
 * A protobuf decoder - takes a byte array and returns an object
 */
export interface Decoder<T> {
  (data: Uint8Array | Uint8ArrayList): T
}

/**
 * A protobuf encoder - takes an object and returns a byte array
 */
export interface Encoder<T> {
  (data: T): Uint8Array
}

/**
 * Convenience methods for working with protobuf streams
 */
export interface ProtobufStream <Stream = unknown> {
  /**
   * Read the next length-prefixed byte array from the stream and decode it as the passed protobuf format
   */
  read<T>(proto: { decode: Decoder<T> }, options?: AbortOptions): Promise<T>

  /**
   * Encode the passed object as a protobuf message and write it's length-prefixed bytes to the stream
   */
  write<T>(data: T, proto: { encode: Encoder<T> }, options?: AbortOptions): Promise<void>

  /**
   * Encode the passed objects as protobuf messages and write their length-prefixed bytes to the stream as a single write
   */
  writeV<T>(input: T[], proto: { encode: Encoder<T> }, options?: AbortOptions): Promise<void>

  /**
   * Returns an object with read/write methods for operating on one specific type of protobuf message
   */
  pb<T>(proto: { encode: Encoder<T>, decode: Decoder<T> }): MessageStream<T, Stream>

  /**
   * Returns the underlying stream
   */
  unwrap(): Stream
}

/**
 * A message reader/writer that only uses one type of message
 */
export interface MessageStream <T, S = unknown> {
  /**
   * Read a message from the stream
   */
  read(options?: AbortOptions): Promise<T>

  /**
   * Write a message to the stream
   */
  write(d: T, options?: AbortOptions): Promise<void>

  /**
   * Write several messages to the stream
   */
  writeV(d: T[], options?: AbortOptions): Promise<void>

  /**
   * Unwrap the underlying protobuf stream
   */
  unwrap(): ProtobufStream<S>
}

export interface ProtobufStreamOpts extends LengthPrefixedStreamOpts {

}

export function pbStream <Stream extends Duplex<any, any, any>> (duplex: Stream, opts?: Partial<ProtobufStreamOpts>): ProtobufStream<Stream> {
  const lp = lpStream(duplex, opts)

  const W: ProtobufStream<Stream> = {
    read: async (proto, options?: AbortOptions) => {
      // readLP, decode
      const value = await lp.read(options)

      return proto.decode(value)
    },
    write: async (message, proto, options?: AbortOptions) => {
      // encode, writeLP
      await lp.write(proto.encode(message), options)
    },
    writeV: async (messages, proto, options?: AbortOptions) => {
      // encode, writeLP
      await lp.writeV(messages.map(message => proto.encode(message)), options)
    },
    pb: (proto) => {
      return {
        read: async (options) => W.read(proto, options),
        write: async (d, options) => W.write(d, proto, options),
        writeV: async (d, options) => W.writeV(d, proto, options),
        unwrap: () => W
      }
    },
    unwrap: () => {
      return lp.unwrap()
    }
  }

  return W
}
