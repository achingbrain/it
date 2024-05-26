import { decode, encode } from 'cborg'
import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<Error> = {
  type: 1032,
  canEncode: (val) => val instanceof Error,
  encode: (val) => encode({
    message: val.message,
    name: val.name,
    // @ts-expect-error field does not exist
    code: val.code,
    // @ts-expect-error field does not exist
    type: val.type,
    stack: val.stack
  }),
  decode: (val) => {
    const details = decode(val)
    const err = new Error(details.message)
    err.name = details.name
    err.stack = details.stack
    // @ts-expect-error field does not exist
    err.code = details.code
    // @ts-expect-error field does not exist
    err.type = details.type

    return err
  }
}

export default transformer
