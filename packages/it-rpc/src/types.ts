import type { DeferredPromise } from 'p-defer'

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
