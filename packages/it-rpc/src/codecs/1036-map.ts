import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<Map<any, any>> = {
  type: 1036,
  canEncode: (val) => val instanceof Map,
  encode: (val, codec, context, invocation) => encode([...val.entries()].map(([key, value]) => [codec.toValue(key, context, invocation), codec.toValue(value, context, invocation)])),
  decode: (val, codec, pushable, invocation) => {
    const map = new Map()
    const arr: any[] = decode(val)

    arr.forEach(([key, value]) => {
      const k = codec.fromValue(key, pushable, invocation)
      const v = codec.fromValue(value, pushable, invocation)

      map.set(k, v)
    })

    return map
  }
}

export default transformer
