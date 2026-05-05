import type { ValueCodec } from '../index.ts'

const transformer: ValueCodec<undefined> = {
  type: 1024,
  canEncode: (val) => val === undefined,
  decode: () => undefined
}

export default transformer
