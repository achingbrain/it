/**
 * @packageDocumentation
 *
 * Your RPC objects must follow a few rules:
 *
 * 1. All RPC methods must return a promise or an async generator
 * 2. Property access on the RPC object is not supported
 * 3. RPC Arguments must not be promises (though may be functions that return promises)
 * 4. The values resolved/yielded from an RPC function must be serializable (e.g. contain no functions) unless custom types are used (see <a href="#custom-types">Custom Types</a> below)
 * 5. AsyncGenerators returned from RPC methods must be either read to completion, or their `.return`/`.throw` methods invoked
 * 6. Callback functions (e.g. functions passed as arguments) should return promises or async generators
 * 7. Callback functions may return `void`, but if so they must not throw
 *
 * @example Getting started
 *
 * ```ts
 * import { rpc } from 'it-rpc'
 *
 * // the invocation target interface - used by the client and the server
 * interface Target {
 *   sayHello(): Promise<string>
 * }
 *
 * // the target implementation, lives on the server side
 * const target: Target = {
 *   async sayHello () {
 *     return 'hello'
 *   }
 * }
 *
 * // create client and server
 * const server = rpc()
 * const client = rpc()
 *
 * // pipe the streams together
 * void server.sink(client.source)
 * void client.sink(server.source)
 *
 * // a string that is the same on both the server and the client
 * const objectName = 'target'
 *
 * // expose target implementation to RPC calls on the server side
 * server.createTarget(objectName, target)
 *
 * // create a client-side version of target
 * const clientTarget = client.createClient<Target>(objectName)
 *
 * // invoke a remote method
 * await clientTarget.sayHello() // 'hello'
 * ```
 *
 * @example Streaming data from the server to the client
 *
 * ```ts
 * import { rpc } from 'it-rpc'
 *
 * interface Target {
 *   streamingMethod(): AsyncGenerator<Uint8Array>
 * }
 *
 * const target: Target = {
 *   async * streamingMethod () {
 *     yield Uint8Array.from([0, 1, 2, 3])
 *     yield Uint8Array.from([4, 5, 6, 7])
 *   }
 * }
 *
 * const server = rpc()
 * const client = rpc()
 * void server.sink(client.source)
 * void client.sink(server.source)
 *
 * const objectName = 'target'
 * server.createTarget(objectName, target)
 *
 * const clientTarget = client.createClient<Target>(objectName)
 *
 * for await (const buf of clientTarget.streamingMethod()) {
 *   console.info(buf)
 *   // Uint8Array([0, 1, 2, 3])
 *   // Uint8Array([4, 5, 6, 7])
 * }
 * ```
 *
 * @example Aborting remote method invocations
 *
 * Any abort signals passed as arguments will have equivalents passed on to the
 * remote method invocation and these will fire their `abort` event when the
 * client side signal fires.
 *
 * ```ts
 * import { rpc } from 'it-rpc'
 *
 * interface Target {
 *   slowStream(arg: { signal: AbortSignal }): AsyncGenerator<Uint8Array>
 * }
 *
 * const target: Target = {
 *   async * slowStream () {
 *     await new Promise<void>((resolve) => {
 *       setTimeout(() => {
 *         resolve()
 *       }, 5000)
 *     })
 *     yield Uint8Array.from([0, 1, 2, 3])
 *     yield Uint8Array.from([4, 5, 6, 7])
 *   }
 * }
 *
 * const server = rpc()
 * const client = rpc()
 * void server.sink(client.source)
 * void client.sink(server.source)
 *
 * const objectName = 'target'
 * server.createTarget(objectName, target)
 *
 * const clientTarget = client.createClient<Target>(objectName)
 *
 * const signal = AbortSignal.timeout(1000)
 *
 * for await (const buf of clientTarget.slowStream({ signal })) {
 *   console.info(buf)
 *   // explodes after 1s
 * }
 * ```
 *
 * ## Custom types
 *
 * It is possible to extend `it-rpc` to support serializing/deserializing custom types by passing `ValueCodec`s to the constructor.
 *
 * Each `ValueCodec` needs a unique `type` field which identifies the value type on the wire.
 *
 * `it-rpc` uses value types starting at `1024` and has a catch-all `2147483647` type which resolves to plain objects.
 *
 * You should define your type values higher than the max value `it-rpc` uses (`2048` is a safe value) but lower than the catch-all type value.
 *
 * Matching codecs are searched for in `type` order so you can override the built-in codecs by specifying a `type` field lower than `1024`.
 *
 * > [!IMPORTANT]
 * > Both the server and the client must be configured with the same set of custom `ValueCodec`s
 *
 * @example Custom Types
 *
 * ```ts
 * import { encode, decode } from 'cborg'
 * import { rpc } from 'it-rpc'
 * import type { ValueCodec } from 'it-rpc'
 *
 * // a custom type we want to encode
 * class MyClass {
 *   field: string
 *
 *   constructor (val: string) {
 *     this.field = val
 *   }
 *
 *   getField () {
 *     return this.field
 *   }
 * }
 *
 * // our custom codec
 * const codec: ValueCodec<MyClass> = {
 *   type: 2048,
 *   canEncode: (val) => val instanceof MyClass,
 *   encode: (val) => encode({ field: val.getField() }),
 *   decode: (buf) => {
 *     const decoded = decode(buf)
 *
 *     return new MyClass(decoded.field)
 *   }
 * }
 *
 * // configure the server/client with the custom codec
 * const server = rpc({
 *   valueCodecs: [
 *     codec
 *   ]
 * })
 * const client = rpc({
 *   valueCodecs: [
 *     codec
 *   ]
 * })
 * void server.sink(client.source)
 * void client.sink(server.source)
 *
 * interface Target {
 *   getFieldFromArg(arg: MyClass): Promise<string>
 * }
 *
 * const target: Target = {
 *   async getFieldFromArg (arg) {
 *     return arg.getField()
 *   }
 * }
 *
 * const objectName = 'target'
 * server.createTarget(objectName, target)
 *
 * const clientTarget = client.createClient<Target>(objectName)
 *
 * const val = new MyClass('hello')
 *
 * await clientTarget.getFieldFromArg(val) // 'hello'
 * ```
 */

import { AbortError } from 'abort-error'
import { anySignal } from 'any-signal'
import { decode as lpDecode, encode as lpEncode } from 'it-length-prefixed'
import { pushable } from 'it-pushable'
import { nanoid } from 'nanoid'
import pDefer from 'p-defer'
import { raceSignal } from 'race-signal'
import { DuplicateScopeError, DuplicateTargetNameError, InvalidInvocationTypeError, InvalidMethodError, InvalidReturnTypeError, MethodNotFoundError, MissingCallbackError, NotConnectedError, TimeoutError } from './errors.js'
import { AbortCallbackMessage, AbortMethodMessage, CallbackRejectedMessage, CallbackResolvedMessage, InvokeCallbackMessage, InvokeMethodMessage, MessageType, MethodRejectedMessage, MethodResolvedMessage, RPCMessage } from './rpc.js'
import { lookUpScope } from './utils.js'
import { Values } from './values.js'
import type { Value } from './rpc.js'
import type { DecoderOptions, EncoderOptions } from 'it-length-prefixed'
import type { Pushable } from 'it-pushable'
import type { Duplex, Source } from 'it-stream-types'
import type { DeferredPromise } from 'p-defer'
import type { EncodeOptions, DecodeOptions } from 'protons-runtime'

export interface Invocation {
  /**
   * The scope of this invocation
   */
  scope: string

  /**
   * The result of the execution
   */
  result: DeferredPromise<any>

  /**
   * Holds references to any callback functions passed as arguments
   */
  callbacks: Map<string, CallbackFunction>

  /**
   * Any ongoing invocations of callbacks during the main method execution
   */
  children: Map<string, Invocation>

  /**
   * Scopes of parent invocations
   */
  parents: string[]

  /**
   * Used on the server side to hold abort controllers that will be aborted
   * if the client sends an abort message
   */
  abortControllers: AbortController[]

  /**
   * Used on the client side to store abort signals that will cause an abort
   * message to be sent
   */
  abortSignals: AbortSignal[]
}

export interface CallbackFunction {
  context: any
  fn (...args: any[]): any
}

export interface ValueCodecs {
  toValue(val: any, context?: any, invocation?: Invocation): Value
  fromValue(val: Value, pushable: Pushable<Uint8Array>, invocation: Invocation): any
}

/**
 * `it-rpc` uses a binary representation of values on the wire. By default it
 * uses [CBOR](https://cbor.io/) though it is not a requirement.
 *
 * Custom `ValueCodec`s can be used to extend the supported value types
 * with application-specific types.
 */
export interface ValueCodec<T = any> {
  /**
   * A unique number for the value type. It's recommended that user defined
   * types use numbers greater than 1000 to avoid conflicting with built in
   * value transformers
   */
  type: number

  /**
   * Return `true` if this transformer can transform this value
   */
  canEncode(val: any): boolean

  /**
   * Encode the passed value to CBOR, if necessary.  The codec should be able
   * to recreate the value from the decoded form of the returned CBOR.
   */
  encode?(val: T, codec: ValueCodecs, context?: any, invocation?: Invocation): Uint8Array

  /**
   * Decode the passed CBOR to recreate the value.
   */
  decode(buf: Uint8Array, codec: ValueCodecs, pushable: Pushable<Uint8Array>, invocation: Invocation): T
}

export interface ClientOptions {
  /**
   * If a remote method invocation is not resolved within this many ms, throw an
   * AbortError
   */
  timeout?: number
}

export interface RPCInit {
  /**
   * Out of the box serializing/deserializing common JavaScript types is
   * supported - if your application uses custom data types you can add support
   * for them by specifying value codecs.
   */
  valueCodecs?: ValueCodec[]

  /**
   * Options passed to the length-prefixed encoder, allows limiting max message
   * size, etc.
   */
  lpEncoder?: EncoderOptions

  /**
   * Options passed to the length-prefixed decoder, allows limiting max message
   * size, etc.
   */
  lpDecoder?: DecoderOptions
}

export interface RPC extends Duplex<AsyncGenerator<Uint8Array, void, unknown>> {
  createClient<T extends object> (name: string, options?: ClientOptions): T
  createTarget (name: string, target: any): void
}

interface MessageHandler<T> {
  decoder: { decode(buf: Uint8Array): T }
  handler(message: T): Promise<void>
}

interface ScopeMessageHandler<T> {
  decoder: { decode(buf: Uint8Array): T }
  handler(message: T, invocation: Invocation): Promise<void>
  isScope: true
  isError?: true
}

function isScopeMessageHandler (handler: any): handler is ScopeMessageHandler<any> {
  return handler.isScope === true
}

function isInvocationMessage (subMessage: any): boolean {
  return subMessage.type === MessageType.invokeMethod || subMessage.type === MessageType.invokeGeneratorMethod || subMessage.type === MessageType.invokeCallback
}

class DuplexRPC implements Duplex<AsyncGenerator<Uint8Array, void, unknown>> {
  public source: AsyncGenerator<Uint8Array, void, undefined>
  private readonly output: Pushable<Uint8Array>

  // used by the server end to track RPC invocation destinations
  private readonly targets: Map<string, any>

  // used by both ends to track function input/output during invocations
  private readonly invocations: Map<string, Invocation>

  // used to serialize/deserialize values
  private readonly values: ValueCodecs

  // handers for incoming protocol message
  private readonly messageHandlers: Record<string, MessageHandler<any> | ScopeMessageHandler<any>>

  // record if we have an onward stream to send messages to
  private connected: boolean

  // options to pass to the decoder
  private readonly lpDecoderOptions?: DecoderOptions

  constructor (init?: RPCInit) {
    this.output = pushable()
    this.source = lpEncode(this.output, init?.lpEncoder)
    this.lpDecoderOptions = init?.lpDecoder

    this.connected = false
    const next = this.source.next
    this.source.next = async (...args: any) => {
      this.connected = true
      return next.apply(this.source, args)
    }

    this.targets = new Map()
    this.invocations = new Map()
    this.values = new Values(init)

    this.sink = this.sink.bind(this)

    this.messageHandlers = {
      [MessageType.invokeMethod]: {
        decoder: InvokeMethodMessage,
        handler: this.handleInvokeMethod.bind(this)
      },
      [MessageType.invokeGeneratorMethod]: {
        decoder: InvokeMethodMessage,
        handler: this.handleInvokeGeneratorMethod.bind(this)
      },
      [MessageType.abortMethodInvocation]: {
        decoder: AbortMethodMessage,
        handler: this.handleAbortMethod.bind(this),
        isScope: true
      },
      [MessageType.methodResolved]: {
        decoder: MethodResolvedMessage,
        handler: this.handleMethodResolved.bind(this),
        isScope: true
      },
      [MessageType.methodRejected]: {
        decoder: MethodRejectedMessage,
        handler: this.handleMethodRejected.bind(this),
        isScope: true,
        isError: true
      },
      [MessageType.invokeCallback]: {
        decoder: InvokeCallbackMessage,
        handler: this.handleInvokeCallback.bind(this),
        isScope: true
      },
      [MessageType.abortCallbackInvocation]: {
        decoder: AbortCallbackMessage,
        handler: this.handleAbortCallback.bind(this),
        isScope: true
      },
      [MessageType.callbackResolved]: {
        decoder: CallbackResolvedMessage,
        handler: this.handleCallbackResolved.bind(this),
        isScope: true
      },
      [MessageType.callbackRejected]: {
        decoder: CallbackRejectedMessage,
        handler: this.handleCallbackRejected.bind(this),
        isScope: true,
        isError: true
      }
    }
  }

  async sink (source: Source<Uint8Array>): Promise<void> {
    for await (const buf of lpDecode(source, this.lpDecoderOptions)) {
      try {
        const message = RPCMessage.decode(buf)
        const messageHandler = this.messageHandlers[message.type]

        if (messageHandler == null) {
          continue
        }

        const subMessage = messageHandler.decoder.decode(message.message)
        let invocation: Invocation | undefined

        if (isScopeMessageHandler(messageHandler)) {
          try {
            invocation = lookUpScope(subMessage, this.invocations)
          } catch (err: any) {
            // the invocation scope was missing - the only times we look up a
            // scope is when we're trying to process a method/callback resolved/
            // rejected method, but there's nothing listening for the outcome so
            // the only thing we can do is ignore the message
            continue
          }
        }

        // @ts-expect-error invocation may be undefined
        messageHandler.handler(subMessage, invocation)
          .catch(err => {
            // we can only send an error message to throw an error to the caller
            // if they are awaiting on the result of an invocation, otherwise
            if (isInvocationMessage(message)) {
              this.sendError(subMessage, err)
            }

            this.invocations.delete(subMessage.scope)
          })
          .finally(() => {
            if (message.type === MessageType.invokeMethod) {
              this.invocations.delete(subMessage.scope)
            }
          })
      } catch {
        // ignore invalid message
        continue
      }
    }
  }

  private sendError (subMessage: any, err: Error): void {
    if (subMessage.parents != null) {
      this.output.push(RPCMessage.encode({
        type: MessageType.callbackRejected,
        message: CallbackRejectedMessage.encode({
          scope: subMessage.scope,
          parents: subMessage.parents,
          error: this.values.toValue(err)
        })
      }))
    } else {
      this.output.push(RPCMessage.encode({
        type: MessageType.methodRejected,
        message: MethodRejectedMessage.encode({
          scope: subMessage.scope,
          error: this.values.toValue(err)
        })
      }))
    }
  }

  createClient<T extends object> (name: string, options?: ClientOptions): T {
    return this.proxy(name, options)
  }

  createTarget (name: string, target: any): void {
    if (this.targets.has(name)) {
      throw new DuplicateTargetNameError(`Cannot reuse RPC target name "${name}"`)
    }

    this.targets.set(name, target)
  }

  private async handleInvokeMethod (message: InvokeMethodMessage): Promise<void> {
    // ensure the scope is not duplicated
    if (this.invocations.has(message.scope)) {
      throw new DuplicateScopeError()
    }

    // set up invocation for callbacks that execute within the scope of this
    // method call
    const callbacks = new Map<string, CallbackFunction>()
    const children = new Map<string, Invocation>()
    const invocation = {
      scope: message.scope,
      result: pDefer(),
      callbacks,
      children,
      parents: [],
      abortControllers: [],
      abortSignals: []
    }
    this.invocations.set(message.scope, invocation)

    const target = this.lookupInvocationTarget(message.path)

    // invoke the method
    const val = await target.fn.apply(target.context, message.args.map(arg => this.values.fromValue(arg, this.output, invocation)))

    this.output.push(RPCMessage.encode({
      type: MessageType.methodResolved,
      message: MethodResolvedMessage.encode({
        scope: message.scope,
        value: this.values.toValue(val)
      })
    }))
  }

  private async handleAbortMethod (message: AbortMethodMessage, invocation: Invocation): Promise<void> {
    invocation.abortControllers.forEach(controller => {
      controller.abort()
    })
  }

  private async handleInvokeGeneratorMethod (message: InvokeMethodMessage): Promise<void> {
    // ensure the scope is not duplicated
    if (this.invocations.has(message.scope)) {
      throw new DuplicateScopeError()
    }

    // set up invocation for callbacks that execute within the scope of this
    // method call
    const callbacks = new Map<string, CallbackFunction>()
    const children = new Map<string, Invocation>()
    const invocation = {
      scope: message.scope,
      result: pDefer(),
      callbacks,
      children,
      parents: [],
      abortControllers: [],
      abortSignals: []
    }
    this.invocations.set(message.scope, invocation)

    const target = this.lookupInvocationTarget(message.path)

    // invoke the method
    const gen = target.fn.apply(target.context, message.args.map(arg => this.values.fromValue(arg, this.output, invocation)))

    if (typeof gen.next !== 'function') {
      throw new InvalidReturnTypeError(`${message.path} did not return an async generator`)
    }

    const asyncGenerator: AsyncGenerator<any, any, any> = {
      next: async () => {
        const result = await gen.next()

        if (result.done === true) {
          this.invocations.delete(message.scope)
        }

        return result
      },
      throw: async (err: any) => {
        try {
          const result = await gen.throw(err)

          if (result.done === true) {
            this.invocations.delete(message.scope)
          }

          return result
        } catch (err) {
          this.invocations.delete(message.scope)
          throw err
        }
      },
      return: async (value: any) => {
        const result = await gen.return(value)

        if (result.done === true) {
          this.invocations.delete(message.scope)
        }

        return result
      },
      [Symbol.asyncIterator]: () => asyncGenerator
    }

    this.output.push(RPCMessage.encode({
      type: MessageType.methodResolved,
      message: MethodResolvedMessage.encode({
        scope: message.scope,
        value: this.values.toValue(asyncGenerator, null, invocation)
      })
    }))
  }

  private lookupInvocationTarget (path: string): { context: any, fn(...args: any[]): any } {
    // look up the requested method on the target
    const pathParts = path.split('.')
    let target = this.targets.get(pathParts[0])
    let context = target

    for (let i = 1; i < pathParts.length; i++) {
      context = target
      target = target?.[pathParts[i]]
    }

    // ensure we have something to invoke
    if (target == null) {
      if (context != null && path.endsWith('.then')) {
        // special case where the client has tried to await property access
        throw new InvalidMethodError(`"${path.substring(0, path.length - 5)}" was not a function`)
      }

      throw new MethodNotFoundError(`Could not find "${path}" on target`)
    }

    // ensure we can invoke the target
    if (typeof target !== 'function') {
      throw new InvalidInvocationTypeError('Invocation target was not a function')
    }

    return { context, fn: target }
  }

  private async handleMethodResolved (message: MethodResolvedMessage, invocation: Invocation): Promise<void> {
    let value: any

    if (message.value != null) {
      value = this.values.fromValue(message.value, this.output, invocation)
    }

    invocation.result.resolve(value)
  }

  private async handleMethodRejected (message: MethodRejectedMessage, invocation: Invocation): Promise<void> {
    let error

    if (message.error != null) {
      error = this.values.fromValue(message.error, this.output, invocation)
    }

    invocation.result.reject(error)
  }

  private async handleInvokeCallback (message: InvokeCallbackMessage, invocation: Invocation): Promise<void> {
    const callback = invocation.callbacks.get(message.callback)

    if (callback == null) {
      throw new MissingCallbackError()
    }

    // invoke the callback
    const val = await callback.fn.apply(callback.context, message.args.map(arg => this.values.fromValue(arg, this.output, invocation)))

    this.output.push(RPCMessage.encode({
      type: MessageType.callbackResolved,
      message: CallbackResolvedMessage.encode({
        scope: message.scope,
        parents: message.parents,
        value: this.values.toValue(val)
      })
    }))
  }

  private async handleAbortCallback (message: AbortCallbackMessage, invocation: Invocation): Promise<void> {
    invocation.abortControllers.forEach(controller => {
      controller.abort()
    })
  }

  private async handleCallbackResolved (message: CallbackResolvedMessage, invocation: Invocation): Promise<void> {
    let value

    if (message.value != null) {
      value = this.values.fromValue(message.value, this.output, invocation)
    }

    invocation.children.get(message.scope)?.result.resolve(value)
    invocation.children.delete(message.scope)
  }

  private async handleCallbackRejected (message: CallbackRejectedMessage, invocation: Invocation): Promise<void> {
    let error

    if (message.error != null) {
      error = this.values.fromValue(message.error, this.output, invocation)
    }

    invocation.children.get(message.scope)?.result.reject(error)
    invocation.children.delete(message.scope)
  }

  private proxy (path: string, options?: ClientOptions): any {
    // proxy a function object because it can be either invoked or it's
    // properties can be accessed.
    const f = (): void => {}
    const self = this

    return new Proxy(f as any, {
      get (target, prop, receiver) {
        return self.proxy(`${path == null ? '' : `${path}.`}${prop.toString()}`, options)
      },

      apply (target, thisArg, argumentsList) {
        let asyncGenerator: any
        let promise: any

        function getPromise (): any {
          if (promise == null) {
            promise = new Promise<any>((resolve, reject) => {
              const scope = nanoid()
              const invocation: Invocation = {
                scope,
                result: pDefer(),
                callbacks: new Map<string, CallbackFunction>(),
                children: new Map<string, Invocation>(),
                parents: [],
                abortControllers: [],
                abortSignals: []
              }

              let timeout: AbortSignal | undefined

              if (options?.timeout != null) {
                timeout = AbortSignal.timeout(options.timeout)
                invocation.abortSignals.push(timeout)
              }

              self.invocations.set(scope, invocation)

              self.output.push(RPCMessage.encode({
                type: MessageType.invokeMethod,
                message: InvokeMethodMessage.encode({
                  scope,
                  path,
                  args: argumentsList.map(val => self.values.toValue(val, null, invocation))
                })
              }))

              const signal = anySignal(invocation.abortSignals)
              signal.addEventListener('abort', () => {
                self.output.push(RPCMessage.encode({
                  type: MessageType.abortMethodInvocation,
                  message: AbortMethodMessage.encode({
                    scope
                  })
                }))

                if (timeout?.aborted === true) {
                  invocation.result.reject(new TimeoutError())
                } else {
                  invocation.result.reject(new AbortError())
                }
              })

              invocation.result.promise.then(result => {
                resolve(result)
              }, (err: Error) => {
                reject(err)
              }).finally(() => {
                self.invocations.delete(scope)
                signal.clear()
              })

              if (!self.connected) {
                invocation.result.reject(new NotConnectedError())
              }
            })
          }

          return promise
        }

        function getAsyncGenerator (): any {
          if (asyncGenerator == null) {
            const scope = nanoid()
            const invocation: Invocation = {
              scope,
              result: pDefer<AsyncGenerator<any, any, any>>(),
              callbacks: new Map<string, CallbackFunction>(),
              children: new Map<string, Invocation>(),
              parents: [],
              abortControllers: [],
              abortSignals: []
            }

            self.invocations.set(scope, invocation)

            self.output.push(RPCMessage.encode({
              type: MessageType.invokeGeneratorMethod,
              message: InvokeMethodMessage.encode({
                scope,
                path,
                args: argumentsList.map(val => self.values.toValue(val, null, invocation))
              })
            }))

            let error: Error | undefined

            asyncGenerator = {
              async next () {
                if (error != null) {
                  throw error
                }

                const signals = [...invocation.abortSignals]
                let timeout: AbortSignal | undefined

                if (options?.timeout != null) {
                  timeout = AbortSignal.timeout(options.timeout)
                  signals.push(timeout)
                }

                const signal = anySignal(signals)

                try {
                  const gen = await raceSignal<AsyncGenerator<any>>(invocation.result.promise, signal)
                  const result = await raceSignal(gen.next(), signal)

                  if (result.done === true) {
                    self.invocations.delete(scope)
                  }

                  return result
                } catch (err: any) {
                  self.invocations.delete(scope)

                  if (timeout?.aborted === true) {
                    throw new TimeoutError()
                  }

                  throw err
                } finally {
                  signal.clear()
                }
              },
              async throw (err: any) {
                if (error != null) {
                  throw error
                }

                const signals = [...invocation.abortSignals]
                let timeout: AbortSignal | undefined

                if (options?.timeout != null) {
                  timeout = AbortSignal.timeout(options.timeout)
                  signals.push(timeout)
                }

                const signal = anySignal(signals)

                try {
                  const gen = await raceSignal<AsyncGenerator<any>>(invocation.result.promise, signal)
                  const result = await raceSignal(gen.throw(err), signal)

                  if (result.done === true) {
                    self.invocations.delete(scope)
                  }

                  return result
                } catch (e: any) {
                  self.invocations.delete(scope)
                  error = err

                  if (timeout?.aborted === true) {
                    error = new TimeoutError()
                    throw error
                  }

                  throw e
                } finally {
                  signal.clear()
                }
              },
              async return (value: any) {
                if (error != null) {
                  throw error
                }

                const signals = [...invocation.abortSignals]
                let timeout: AbortSignal | undefined

                if (options?.timeout != null) {
                  timeout = AbortSignal.timeout(options.timeout)
                  signals.push(timeout)
                }

                const signal = anySignal(signals)

                try {
                  const gen = await raceSignal<AsyncGenerator<any>>(invocation.result.promise, signal)
                  const result = await raceSignal(gen.return(value), signal)

                  if (result.done === true) {
                    self.invocations.delete(scope)
                  }

                  return result
                } catch (err: any) {
                  self.invocations.delete(scope)

                  if (timeout?.aborted === true) {
                    throw new TimeoutError()
                  }

                  throw err
                } finally {
                  signal.clear()
                }
              },
              [Symbol.asyncIterator]: () => asyncGenerator
            }

            if (!self.connected) {
              invocation.result.reject(new NotConnectedError())
            }
          }

          return asyncGenerator
        }

        // return proxy for return value - if `.then` is called, the caller
        // expects a promise, if `Symbol.asyncIterator` is accessed, they want
        // an async generator
        return new Proxy(f as any, {
          // method cannot be async because async generators have a synchronous
          // return value
          get (target, prop, receiver) {
            if (prop === 'then') {
              return getPromise().then.bind(promise)
            }

            if (prop === 'catch') {
              return getPromise().catch.bind(promise)
            }

            if (prop === 'finally') {
              return getPromise().finally.bind(promise)
            }

            if (prop === Symbol.asyncIterator) {
              return () => getAsyncGenerator()
            }

            if (prop === 'next') {
              return getAsyncGenerator().next.bind(asyncGenerator)
            }

            if (prop === 'return') {
              return getAsyncGenerator().return.bind(asyncGenerator)
            }

            if (prop === 'throw') {
              return getAsyncGenerator().throw.bind(asyncGenerator)
            }

            if (prop === Symbol.toStringTag) {
              return '[object Object]'
            }

            if (prop === 'constructor') {
              return () => {}
            }

            throw new InvalidInvocationTypeError(`Property ${prop.toString()} was not used as a promise or async generator`)
          }
        })
      }
    })
  }
}

export function rpc (init?: RPCInit): RPC {
  return new DuplexRPC(init)
}
