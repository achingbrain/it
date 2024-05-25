import type { ValueCodec } from '../index.js'

const transformer: ValueCodec<AbortSignal> = {
  type: 1039,
  canEncode: (val) => val instanceof AbortSignal,
  encode: (val, codec, context, invocation) => {
    invocation?.abortSignals.push(val)

    return new Uint8Array(0)
  },
  decode: (val, codec, pushable, invocation) => {
    const controller = new AbortController()
    invocation.abortControllers.push(controller)

    return controller.signal
  }
}

export default transformer
