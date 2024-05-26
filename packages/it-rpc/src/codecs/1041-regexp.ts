import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<RegExp> = {
  type: 1041,
  canEncode: (val) => val instanceof RegExp,
  encode: (val) => encode({ source: val.source, flags: val.flags }),
  decode: (val) => {
    const { source, flags } = decode(val)

    return new RegExp(source, flags)
  }
}

export default transformer
