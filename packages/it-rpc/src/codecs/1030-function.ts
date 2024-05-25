import { anySignal } from 'any-signal'
import { decode, encode } from 'cborg'
import pDefer from 'p-defer'
import { AbortCallbackMessage, InvokeCallbackMessage, MessageType, RPCMessage } from '../rpc.js'
import type { ValueCodec, CallbackFunction, Invocation } from '../index.js'

const transformer: ValueCodec<(...args: any[]) => any> = {
  type: 1030,
  canEncode: (val) => typeof val === 'function',
  encode: (val, codec, context, invocation) => {
    // store a reference to the function so it can be invoked later
    const id = crypto.randomUUID()
    invocation?.callbacks.set(id, {
      context,
      fn: val
    })

    return encode(id)
  },
  decode: (val, codec, pushable, invocation) => {
    return async (...args: any[]): Promise<any> => {
      return new Promise<any>((resolve, reject) => {
        const id = decode(val)
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
            callback: id,
            args: args.map(val => codec.toValue(val, null, callbackInvocation))
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
}

export default transformer
