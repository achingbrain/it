import { anySignal } from 'any-signal'
import pDefer from 'p-defer'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { UnsupportedValueTypeError } from './errors.js'
import { AbortCallbackMessage, InvokeCallbackMessage, MessageType, RPCMessage, ValueType } from './rpc.js'
import type { Value } from './rpc.js'
import type { CallbackFunction, Invocation } from './types.js'
import type { Pushable } from 'it-pushable'

const IGNORE_OBJECT_PROPS = [
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  '__proto__',
  'toLocaleString',
  'constructor'
]

interface ValueTransformer {
  type: ValueType
  test(val: any): boolean
  toValue(val: any, context?: any, invocation?: Invocation): string
  fromValue(val: Value, pushable: Pushable<Uint8Array>, invocation: Invocation): any
}

const valueTransformers: ValueTransformer[] = [{
  // 0 - undefined
  type: ValueType.undefined,
  test: (val) => val === undefined,
  toValue: () => '',
  fromValue: () => undefined
}, {
  // 1 - null
  type: ValueType.null,
  test: (val) => val === null,
  toValue: () => '',
  fromValue: () => null
}, {
  // 2 - boolean
  type: ValueType.Boolean,
  test: (val) => val === true || val === false,
  toValue: (val) => JSON.stringify(val),
  fromValue: (val) => val.value === 'true'
}, {
  // 3 - number
  type: ValueType.Number,
  test: (val) => typeof val === 'number' && !isNaN(val),
  toValue: (val) => JSON.stringify(val),
  fromValue: (val) => Number(val.value)
}, {
  // 4 - string
  type: ValueType.String,
  test: (val) => typeof val === 'string',
  toValue: (val) => val,
  fromValue: (val) => val.value
}, {
  // 5 - array
  type: ValueType.Array,
  test: (val) => Array.isArray(val),
  toValue: (val: any[], context, invocation) => JSON.stringify(val.map(val => toValue(val, context, invocation))),
  fromValue: (val, pushable, invocation) => (JSON.parse(val.value) as any[]).map(val => fromValue(val, pushable, invocation))
}, {
  // 7 - function
  type: ValueType.Function,
  test: (val) => typeof val === 'function',
  toValue: (val, context, invocation) => {
    // store a reference to the function so it can be invoked later
    const id = crypto.randomUUID()
    invocation?.callbacks.set(id, {
      context,
      fn: val
    })

    return id
  },
  fromValue: (val, pushable, invocation) => {
    return async (...args: any[]): Promise<any> => {
      return new Promise<any>((resolve, reject) => {
        const scope = crypto.randomUUID()

        const callbackInvocation: Invocation = {
          scope,
          result: pDefer(),
          callbacks: new Map<string, CallbackFunction>(),
          children: new Map<string, Invocation>(),
          parents: [...invocation.parents, invocation.scope],
          abortControllers: [],
          abortSignals: []
        }

        invocation.children.set(scope, callbackInvocation)

        pushable.push(RPCMessage.encode({
          type: MessageType.invokeCallback,
          message: InvokeCallbackMessage.encode({
            scope,
            parents: callbackInvocation.parents,
            callback: val.value,
            args: args.map(val => toValue(val, null, callbackInvocation))
          })
        }))

        const signal = anySignal(invocation.abortSignals)
        signal.addEventListener('abort', () => {
          pushable.push(RPCMessage.encode({
            type: MessageType.abortCallbackInvocation,
            message: AbortCallbackMessage.encode({
              scope,
              parents: callbackInvocation.parents
            })
          }))
        })

        callbackInvocation.result.promise.then(result => {
          resolve(result)
        }, err => {
          reject(err)
        }).finally(() => {
          invocation.children.delete(scope)
          signal.clear()
        })
      })
    }
  }
}, {
  // 8 - NaN
  type: ValueType.NaN,
  test: (val) => val.toString() === 'NaN' && isNaN(val),
  toValue: () => '',
  fromValue: () => NaN
}, {
  // 9 - Error
  type: ValueType.Error,
  test: (val) => val instanceof Error,
  toValue: (val) => JSON.stringify({
    message: val.message,
    name: val.name,
    code: val.code,
    type: val.type,
    stack: val.stack
  }),
  fromValue: (val) => {
    const details = JSON.parse(val.value)
    const err = new Error(details.message)
    err.name = details.name
    err.stack = details.stack
    // @ts-expect-error field does not exist
    err.code = details.code
    // @ts-expect-error field does not exist
    err.type = details.type

    return err
  }
}, {
  // 10 - Promise (not supported)
  type: ValueType.Promise,
  test: (val) => typeof val.then === 'function' && typeof val.catch === 'function',
  toValue: () => {
    throw new Error('Promises are not supported')
  },
  fromValue: () => {
    throw new Error('Promises are not supported')
  }
}, {
  // 11 - async generator
  type: ValueType.AsyncGenerator,
  test: (val) => typeof val.next === 'function' && typeof val.throw === 'function' && typeof val.return === 'function',
  toValue: (val, context, invocation) => {
    return valueTransformerMap.Object.toValue({
      next: val.next.bind(val),
      throw: val.throw.bind(val),
      return: val.return.bind(val)
    }, context, invocation)
  },
  fromValue: (val, pushable, invocation) => {
    const value = fromValue({
      type: ValueType.Object,
      value: val.value
    }, pushable, invocation)
    value[Symbol.asyncIterator] = () => value

    return value
  }
}, {
  // 12 - bigint
  type: ValueType.BigInt,
  test: (val) => typeof val === 'bigint',
  toValue: (val) => val.toString(),
  fromValue: (val) => BigInt(val.value)
}, {
  // 13 - Map
  type: ValueType.Map,
  test: (val) => val instanceof Map,
  toValue: (val, context, invocation) => JSON.stringify([...val.entries()].map(([key, value]) => [toValue(key, context, invocation), toValue(value, context, invocation)])),
  fromValue: (val, pushable, invocation) => {
    const map = new Map()
    const arr: any[] = JSON.parse(val.value)

    arr.forEach(([key, value]) => {
      const k = fromValue(key, pushable, invocation)
      const v = fromValue(value, pushable, invocation)

      map.set(k, v)
    })

    return map
  }
}, {
  // 14 - Set
  type: ValueType.Set,
  test: (val) => val instanceof Set,
  toValue: (val, context, invocation) => JSON.stringify([...val.values()].map(value => toValue(value, context, invocation))),
  fromValue: (val, pushable, invocation) => {
    const set = new Set()
    const arr: any[] = JSON.parse(val.value)

    arr.forEach(val => {
      set.add(fromValue(val, pushable, invocation))
    })

    return set
  }
}, {
  // 15 - Uint8Array
  type: ValueType.Uint8Array,
  test: (val) => val instanceof Uint8Array,
  toValue: (val) => uint8ArrayToString(val, 'base64'),
  fromValue: (val) => uint8ArrayFromString(val.value, 'base64')
}, {
  // 16 - AbortSignal
  type: ValueType.AbortSignal,
  test: (val) => val instanceof AbortSignal,
  toValue: (val, context, invocation) => {
    invocation?.abortSignals.push(val)

    return ''
  },
  fromValue: (val, pushable, invocation) => {
    const controller = new AbortController()
    invocation.abortControllers.push(controller)

    return controller.signal
  }
}, {
  // 17 - Date
  type: ValueType.Date,
  test: (val) => val instanceof Date,
  toValue: (val) => val.toString(),
  fromValue: (val) => new Date(val.value)
}, {
  // 18 - RegExp
  type: ValueType.RegExp,
  test: (val) => val instanceof RegExp,
  toValue: (val) => JSON.stringify({ source: val.source, flags: val.flags }),
  fromValue: (val) => {
    const { source, flags } = JSON.parse(val.value)

    return new RegExp(source, flags)
  }
}, {
  // 6 - object - declared last in this list so the simple`typeof` test doesn't
  // catch other supported types
  type: ValueType.Object,
  test: (val) => typeof val === 'object',
  toValue: (val, context, invocation) => {
    const output: Record<string, any> = {}

    // collect properties
    for (const prop in val) {
      if (IGNORE_OBJECT_PROPS.includes(prop)) {
        continue
      }

      if (Object.hasOwn(val, prop)) {
        output[prop] = val[prop]
      }
    }

    // collect es6 methods
    for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(val))) {
      if (IGNORE_OBJECT_PROPS.includes(name)) {
        continue
      }

      output[name] = val[name]
    }

    return JSON.stringify([...Object.entries(output)].map(([key, value]) => [toValue(key, val, invocation), toValue(value, val, invocation)]))
  },
  fromValue: (val, pushable, invocation) => {
    const output: Record<any, any> = {}
    const arr: any[] = JSON.parse(val.value)

    arr.forEach(([key, value]) => {
      output[fromValue(key, pushable, invocation)] = fromValue(value, pushable, invocation)
    })

    return output
  }
}]

const valueTransformerMap: Record<string, ValueTransformer> = {}
valueTransformers.forEach(transformer => {
  valueTransformerMap[transformer.type] = transformer
})

export function toValue (val: any, context?: any, invocation?: Invocation): Value {
  for (let i = 0; i < valueTransformers.length; i++) {
    const transformer = valueTransformers[i]

    if (transformer.test(val)) {
      return {
        type: transformer.type,
        value: transformer.toValue(val, context, invocation)
      }
    }
  }

  throw new UnsupportedValueTypeError(`Unsupported value type "${val}"`)
}

export function fromValue (val: Value, pushable: Pushable<Uint8Array>, invocation: Invocation): any {
  const transformer = valueTransformerMap[val.type]

  if (transformer == null) {
    throw new UnsupportedValueTypeError(`Unsupported value type "${val.type}"`)
  }

  return transformer.fromValue(val, pushable, invocation)
}
