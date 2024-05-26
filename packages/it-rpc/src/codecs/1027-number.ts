import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<number> = {
  type: 1027,
  canEncode: (val) => typeof val === 'number' && !isNaN(val),
  encode: (val) => encode(val),
  decode: (val) => decode(val)
}

export default transformer
