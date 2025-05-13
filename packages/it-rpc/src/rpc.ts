/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { decodeMessage, encodeMessage, enumeration, MaxLengthError, message } from 'protons-runtime'
import { alloc as uint8ArrayAlloc } from 'uint8arrays/alloc'
import type { Codec, DecodeOptions } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export enum MessageType {
  invokeMethod = 'invokeMethod',
  methodResolved = 'methodResolved',
  methodRejected = 'methodRejected',
  invokeGeneratorMethod = 'invokeGeneratorMethod',
  abortMethodInvocation = 'abortMethodInvocation',
  invokeCallback = 'invokeCallback',
  callbackResolved = 'callbackResolved',
  callbackRejected = 'callbackRejected',
  abortCallbackInvocation = 'abortCallbackInvocation'
}

enum __MessageTypeValues {
  invokeMethod = 0,
  methodResolved = 1,
  methodRejected = 2,
  invokeGeneratorMethod = 3,
  abortMethodInvocation = 4,
  invokeCallback = 5,
  callbackResolved = 6,
  callbackRejected = 7,
  abortCallbackInvocation = 8
}

export namespace MessageType {
  export const codec = (): Codec<MessageType> => {
    return enumeration<MessageType>(__MessageTypeValues)
  }
}
export interface Value {
  type: number
  value?: Uint8Array
}

export namespace Value {
  let _codec: Codec<Value>

  export const codec = (): Codec<Value> => {
    if (_codec == null) {
      _codec = message<Value>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.type != null && obj.type !== 0)) {
          w.uint32(8)
          w.uint32(obj.type)
        }

        if (obj.value != null) {
          w.uint32(18)
          w.bytes(obj.value)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          type: 0
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.type = reader.uint32()
              break
            }
            case 2: {
              obj.value = reader.bytes()
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<Value>): Uint8Array => {
    return encodeMessage(obj, Value.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Value>): Value => {
    return decodeMessage(buf, Value.codec(), opts)
  }
}

export interface RPCMessage {
  type: MessageType
  message: Uint8Array
}

export namespace RPCMessage {
  let _codec: Codec<RPCMessage>

  export const codec = (): Codec<RPCMessage> => {
    if (_codec == null) {
      _codec = message<RPCMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (obj.type != null && __MessageTypeValues[obj.type] !== 0) {
          w.uint32(8)
          MessageType.codec().encode(obj.type, w)
        }

        if ((obj.message != null && obj.message.byteLength > 0)) {
          w.uint32(18)
          w.bytes(obj.message)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          type: MessageType.invokeMethod,
          message: uint8ArrayAlloc(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.type = MessageType.codec().decode(reader)
              break
            }
            case 2: {
              obj.message = reader.bytes()
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<RPCMessage>): Uint8Array => {
    return encodeMessage(obj, RPCMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<RPCMessage>): RPCMessage => {
    return decodeMessage(buf, RPCMessage.codec(), opts)
  }
}

export interface InvokeMethodMessage {
  scope: string
  path: string
  args: Value[]
}

export namespace InvokeMethodMessage {
  let _codec: Codec<InvokeMethodMessage>

  export const codec = (): Codec<InvokeMethodMessage> => {
    if (_codec == null) {
      _codec = message<InvokeMethodMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if ((obj.path != null && obj.path !== '')) {
          w.uint32(18)
          w.string(obj.path)
        }

        if (obj.args != null) {
          for (const value of obj.args) {
            w.uint32(26)
            Value.codec().encode(value, w)
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: '',
          path: '',
          args: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            case 2: {
              obj.path = reader.string()
              break
            }
            case 3: {
              if (opts.limits?.args != null && obj.args.length === opts.limits.args) {
                throw new MaxLengthError('Decode error - map field "args" had too many elements')
              }

              obj.args.push(Value.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.args$
              }))
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<InvokeMethodMessage>): Uint8Array => {
    return encodeMessage(obj, InvokeMethodMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<InvokeMethodMessage>): InvokeMethodMessage => {
    return decodeMessage(buf, InvokeMethodMessage.codec(), opts)
  }
}

export interface AbortMethodMessage {
  scope: string
}

export namespace AbortMethodMessage {
  let _codec: Codec<AbortMethodMessage>

  export const codec = (): Codec<AbortMethodMessage> => {
    if (_codec == null) {
      _codec = message<AbortMethodMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<AbortMethodMessage>): Uint8Array => {
    return encodeMessage(obj, AbortMethodMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<AbortMethodMessage>): AbortMethodMessage => {
    return decodeMessage(buf, AbortMethodMessage.codec(), opts)
  }
}

export interface MethodResolvedMessage {
  scope: string
  value?: Value
}

export namespace MethodResolvedMessage {
  let _codec: Codec<MethodResolvedMessage>

  export const codec = (): Codec<MethodResolvedMessage> => {
    if (_codec == null) {
      _codec = message<MethodResolvedMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if (obj.value != null) {
          w.uint32(18)
          Value.codec().encode(obj.value, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            case 2: {
              obj.value = Value.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.value
              })
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<MethodResolvedMessage>): Uint8Array => {
    return encodeMessage(obj, MethodResolvedMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<MethodResolvedMessage>): MethodResolvedMessage => {
    return decodeMessage(buf, MethodResolvedMessage.codec(), opts)
  }
}

export interface MethodRejectedMessage {
  scope: string
  error?: Value
}

export namespace MethodRejectedMessage {
  let _codec: Codec<MethodRejectedMessage>

  export const codec = (): Codec<MethodRejectedMessage> => {
    if (_codec == null) {
      _codec = message<MethodRejectedMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if (obj.error != null) {
          w.uint32(18)
          Value.codec().encode(obj.error, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            case 2: {
              obj.error = Value.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.error
              })
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<MethodRejectedMessage>): Uint8Array => {
    return encodeMessage(obj, MethodRejectedMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<MethodRejectedMessage>): MethodRejectedMessage => {
    return decodeMessage(buf, MethodRejectedMessage.codec(), opts)
  }
}

export interface InvokeCallbackMessage {
  scope: string
  parents: string[]
  callback: string
  args: Value[]
}

export namespace InvokeCallbackMessage {
  let _codec: Codec<InvokeCallbackMessage>

  export const codec = (): Codec<InvokeCallbackMessage> => {
    if (_codec == null) {
      _codec = message<InvokeCallbackMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if (obj.parents != null) {
          for (const value of obj.parents) {
            w.uint32(18)
            w.string(value)
          }
        }

        if ((obj.callback != null && obj.callback !== '')) {
          w.uint32(26)
          w.string(obj.callback)
        }

        if (obj.args != null) {
          for (const value of obj.args) {
            w.uint32(34)
            Value.codec().encode(value, w)
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: '',
          parents: [],
          callback: '',
          args: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            case 2: {
              if (opts.limits?.parents != null && obj.parents.length === opts.limits.parents) {
                throw new MaxLengthError('Decode error - map field "parents" had too many elements')
              }

              obj.parents.push(reader.string())
              break
            }
            case 3: {
              obj.callback = reader.string()
              break
            }
            case 4: {
              if (opts.limits?.args != null && obj.args.length === opts.limits.args) {
                throw new MaxLengthError('Decode error - map field "args" had too many elements')
              }

              obj.args.push(Value.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.args$
              }))
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<InvokeCallbackMessage>): Uint8Array => {
    return encodeMessage(obj, InvokeCallbackMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<InvokeCallbackMessage>): InvokeCallbackMessage => {
    return decodeMessage(buf, InvokeCallbackMessage.codec(), opts)
  }
}

export interface AbortCallbackMessage {
  scope: string
  parents: string[]
}

export namespace AbortCallbackMessage {
  let _codec: Codec<AbortCallbackMessage>

  export const codec = (): Codec<AbortCallbackMessage> => {
    if (_codec == null) {
      _codec = message<AbortCallbackMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if (obj.parents != null) {
          for (const value of obj.parents) {
            w.uint32(18)
            w.string(value)
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: '',
          parents: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            case 2: {
              if (opts.limits?.parents != null && obj.parents.length === opts.limits.parents) {
                throw new MaxLengthError('Decode error - map field "parents" had too many elements')
              }

              obj.parents.push(reader.string())
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<AbortCallbackMessage>): Uint8Array => {
    return encodeMessage(obj, AbortCallbackMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<AbortCallbackMessage>): AbortCallbackMessage => {
    return decodeMessage(buf, AbortCallbackMessage.codec(), opts)
  }
}

export interface CallbackResolvedMessage {
  scope: string
  parents: string[]
  value?: Value
}

export namespace CallbackResolvedMessage {
  let _codec: Codec<CallbackResolvedMessage>

  export const codec = (): Codec<CallbackResolvedMessage> => {
    if (_codec == null) {
      _codec = message<CallbackResolvedMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if (obj.parents != null) {
          for (const value of obj.parents) {
            w.uint32(18)
            w.string(value)
          }
        }

        if (obj.value != null) {
          w.uint32(26)
          Value.codec().encode(obj.value, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: '',
          parents: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            case 2: {
              if (opts.limits?.parents != null && obj.parents.length === opts.limits.parents) {
                throw new MaxLengthError('Decode error - map field "parents" had too many elements')
              }

              obj.parents.push(reader.string())
              break
            }
            case 3: {
              obj.value = Value.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.value
              })
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<CallbackResolvedMessage>): Uint8Array => {
    return encodeMessage(obj, CallbackResolvedMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<CallbackResolvedMessage>): CallbackResolvedMessage => {
    return decodeMessage(buf, CallbackResolvedMessage.codec(), opts)
  }
}

export interface CallbackRejectedMessage {
  scope: string
  parents: string[]
  error?: Value
}

export namespace CallbackRejectedMessage {
  let _codec: Codec<CallbackRejectedMessage>

  export const codec = (): Codec<CallbackRejectedMessage> => {
    if (_codec == null) {
      _codec = message<CallbackRejectedMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.scope != null && obj.scope !== '')) {
          w.uint32(10)
          w.string(obj.scope)
        }

        if (obj.parents != null) {
          for (const value of obj.parents) {
            w.uint32(18)
            w.string(value)
          }
        }

        if (obj.error != null) {
          w.uint32(26)
          Value.codec().encode(obj.error, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          scope: '',
          parents: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.scope = reader.string()
              break
            }
            case 2: {
              if (opts.limits?.parents != null && obj.parents.length === opts.limits.parents) {
                throw new MaxLengthError('Decode error - map field "parents" had too many elements')
              }

              obj.parents.push(reader.string())
              break
            }
            case 3: {
              obj.error = Value.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.error
              })
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<CallbackRejectedMessage>): Uint8Array => {
    return encodeMessage(obj, CallbackRejectedMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<CallbackRejectedMessage>): CallbackRejectedMessage => {
    return decodeMessage(buf, CallbackRejectedMessage.codec(), opts)
  }
}
