import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<Promise<any>> = {
  type: 1033,
  canEncode: (val) => Array.isArray(val),
  encode: (val, codec, context, invocation) => {
    throw new Error('Promises are not supported')
  },
  decode: (val, codec, pushable, invocation) => {
    throw new Error('Promises are not supported')
  }
}

export default transformer
