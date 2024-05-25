import objectTransformer from './2147483647-object.js'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<AsyncGenerator<any>> = {
  type: 1034,
  canEncode: (val) => typeof val.next === 'function' && typeof val.throw === 'function' && typeof val.return === 'function',
  encode: (val, codec, context, invocation) => objectTransformer.encode({
    next: val.next.bind(val),
    throw: val.throw.bind(val),
    return: val.return.bind(val)
  }, codec, context, invocation),
  decode: (val, codec, pushable, invocation) => {
    const value = objectTransformer.decode(val, codec, pushable, invocation)
    value[Symbol.asyncIterator] = () => value

    return value
  }
}

export default transformer
