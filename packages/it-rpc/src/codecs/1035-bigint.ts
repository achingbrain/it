import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<bigint> = {
  type: 1035,
  canEncode: (val) => typeof val === 'bigint',
  encode: (val) => encode(val),
  decode: (val) => BigInt(decode(val))
}

export default transformer
