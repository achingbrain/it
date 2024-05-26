import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<any[]> = {
  type: 1029,
  canEncode: (val) => Array.isArray(val),
  encode: (val, codec, context, invocation) => encode(val.map(val => codec.toValue(val, context, invocation))),
  decode: (val, codec, pushable, invocation) => decode(val).map((val: any) => codec.fromValue(val, pushable, invocation))
}

export default transformer
