/**
 * @packageDocumentation
 *
 * This module makes it easy to send and receive ndjson messages over streams.
 *
 * @example
 *
 * ```typescript
 * import { ndjsonStream } from 'it-ndjson-stream'
 *
 * const stream = ndjsonStream(duplex)
 *
 * // read the next message
 * const obj = await stream.read()
 *
 * // write a message
 * await stream.write({ hello: 'world' })
 *
 * // write several messages
 * await stream.writeV([
 *   { hello: 'world' },
 *   { how: 'are you' }
 * ])
 * ```
 */
import { parse } from 'it-ndjson'
import { queuelessPushable } from 'it-queueless-pushable'
import { raceSignal } from 'race-signal'
import { UnexpectedEOFError } from './errors.js'
import type { ParseOptions } from 'it-ndjson'
import type { Duplex } from 'it-stream-types'

export interface AbortOptions {
  signal?: AbortSignal
}

export interface NDJSONStream <T = any, Stream = unknown> {
  /**
   * Read the next message from the stream
   */
  read(options?: AbortOptions): Promise<T>

  /**
   * Write the passed message to the stream
   */
  write (input: T, options?: AbortOptions): Promise<void>

  /**
   * Returns the underlying stream
   */
  unwrap(): Stream
}

export interface NDJSONStreamOpts extends ParseOptions {

}

export function ndjsonStream <T = any, Stream extends Duplex<any, any, any> = Duplex<any, any, any>> (duplex: Stream, opts: Partial<NDJSONStreamOpts> = {}): NDJSONStream<T, Stream> {
  const input = parse<T>(duplex.source, opts)
  const output = queuelessPushable()

  duplex.sink(output).catch(async (err: Error) => {
    await output.end(err)
  })

  duplex.sink = async (source: any) => {
    for await (const buf of source) {
      await output.push(buf)
    }

    await output.end()
  }

  const W: NDJSONStream<T, Stream> = {
    read: async (options?: AbortOptions) => {
      const result = await raceSignal(input.next(), options?.signal)

      if (result.done === true) {
        throw new UnexpectedEOFError('unexpected end of input')
      }

      if (result.value == null) {
        throw new UnexpectedEOFError('unexpected end of input')
      }

      return result.value
    },
    write: async (data, options?: AbortOptions) => {
      options?.signal?.throwIfAborted()

      const buf = new TextEncoder().encode(JSON.stringify(data) + '\n')

      await output.push(buf, options)
    },
    unwrap: () => {
      return duplex
    }
  }

  return W
}
