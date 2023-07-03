/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { encodeMessage, decodeMessage, message } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface TestMessage {
  foo: string
}

export namespace TestMessage {
  let _codec: Codec<TestMessage>

  export const codec = (): Codec<TestMessage> => {
    if (_codec == null) {
      _codec = message<TestMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.foo != null && obj.foo !== '')) {
          w.uint32(10)
          w.string(obj.foo)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          foo: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.foo = reader.string()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<TestMessage>): Uint8Array => {
    return encodeMessage(obj, TestMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): TestMessage => {
    return decodeMessage(buf, TestMessage.codec())
  }
}
