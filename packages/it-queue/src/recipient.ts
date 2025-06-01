import { AbortError } from 'abort-error'

export class JobRecipient<JobReturnType> {
  public deferred: PromiseWithResolvers<JobReturnType>
  public signal?: AbortSignal

  constructor (signal?: AbortSignal) {
    this.signal = signal
    this.deferred = Promise.withResolvers()

    this.onAbort = this.onAbort.bind(this)
    this.signal?.addEventListener('abort', this.onAbort)
  }

  onAbort (): void {
    this.deferred.reject(this.signal?.reason ?? new AbortError())
  }

  cleanup (): void {
    this.signal?.removeEventListener('abort', this.onAbort)
  }
}
