import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<Set<any>> = {
  type: 1037,
  canEncode: (val) => val instanceof Set,
  encode: (val, codec, context, invocation) => encode([...val.values()].map(value => codec.toValue(value, context, invocation))),
  decode: (val, codec, pushable, invocation) => {
    const set = new Set()
    const arr: any[] = decode(val)

    arr.forEach(val => {
      set.add(codec.fromValue(val, pushable, invocation))
    })

    return set
  }
}

export default transformer
