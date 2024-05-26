import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<typeof NaN> = {
  type: 1031,
  canEncode: (val) => val.toString() === 'NaN' && isNaN(val),
  decode: () => NaN
}

export default transformer
