import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const IGNORE_OBJECT_PROPS = [
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  '__proto__',
  'toLocaleString',
  'constructor'
]

const transformer: Required<ValueCodec<any>> = {
  type: 2147483647,
  canEncode: (val) => typeof val === 'object',
  encode: (val, codec, context, invocation) => {
    const output: Record<string, any> = {}

    // collect properties
    for (const prop in val) {
      if (IGNORE_OBJECT_PROPS.includes(prop)) {
        continue
      }

      if (Object.hasOwn(val, prop)) {
        output[prop] = val[prop]
      }
    }

    // collect es6 methods
    for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(val))) {
      if (IGNORE_OBJECT_PROPS.includes(name)) {
        continue
      }

      output[name] = val[name]
    }

    return encode([...Object.entries(output)].map(([key, value]) => [codec.toValue(key, val, invocation), codec.toValue(value, val, invocation)]))
  },
  decode: (val, codec, pushable, invocation) => {
    const output: Record<any, any> = {}
    const arr: any[] = decode(val)

    arr.forEach(([key, value]) => {
      output[codec.fromValue(key, pushable, invocation)] = codec.fromValue(value, pushable, invocation)
    })

    return output
  }
}

export default transformer
