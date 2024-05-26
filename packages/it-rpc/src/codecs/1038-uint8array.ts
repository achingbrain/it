import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<Uint8Array> = {
  type: 1038,
  canEncode: (val) => val instanceof Uint8Array,
  encode: (val) => val,
  decode: (val) => val
}

export default transformer
