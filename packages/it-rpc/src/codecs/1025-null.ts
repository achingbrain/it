import type { ValueCodec } from '../index.ts'

const transformer: ValueCodec<null> = {
  type: 1025,
  canEncode: (val) => val === null,
  decode: () => null
}

export default transformer
