import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<boolean> = {
  type: 1026,
  canEncode: (val) => val === true || val === false,
  encode: (val) => encode(val),
  decode: (val) => decode(val)
}

export default transformer
