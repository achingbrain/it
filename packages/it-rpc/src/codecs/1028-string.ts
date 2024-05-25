import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<string> = {
  type: 1028,
  canEncode: (val) => typeof val === 'string',
  encode: (val) => encode(val),
  decode: (val) => decode(val)
}

export default transformer
