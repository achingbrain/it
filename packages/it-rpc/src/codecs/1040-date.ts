import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<Date> = {
  type: 1040,
  canEncode: (val) => val instanceof Date,
  encode: (val) => encode(val.toString()),
  decode: (val) => new Date(decode(val))
}

export default transformer
