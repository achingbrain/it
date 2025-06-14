/**
 * @packageDocumentation
 *
 * Based on `p-queue` but with access to the underlying queue, aborting a task
 * removes it from the queue and you can iterate over the queue results.
 *
 * @example
 *
 * ```ts
 * import all from 'it-all'
 * import { Queue } from 'it-queue'
 *
 * const queue = new Queue({
 *   concurrency: Infinity
 * })
 * void queue.add(async () => {
 *   return 'hello'
 * })
 * void queue.add(async () => {
 *   return 'world'
 * })
 *
 * const results = await all(queue)
 * // ['hello', 'world']
 *
 * // how many items are in the queue (includes running items)
 * console.info(queue.size)
 *
 * // how many items are running
 * console.info(queue.running)
 *
 * // how many items have not started running yet
 * console.info(queue.queued)
 * ```
 */

import { AbortError } from 'abort-error'
import { pushable } from 'it-pushable'
import { TypedEventEmitter } from 'main-event'
import { raceEvent } from 'race-event'
import { QueueFullError } from './errors.js'
import { Job } from './job.js'
import { debounce } from './utils.js'
import type { AbortOptions } from 'abort-error'
export type { Job, JobTimeline } from './job.js'
export type { JobRecipient } from './recipient.js'

export interface Comparator<T> {
  (a: T, b: T): -1 | 0 | 1
}

export interface QueueInit<JobReturnType, JobOptions extends AbortOptions = AbortOptions> {
  /**
   * Concurrency limit.
   *
   * Minimum: `1`.
   *
   * @default Infinity
   */
  concurrency?: number

  /**
   * If the queue size grows to larger than this number the promise returned
   * from the add function will reject
   *
   * @default Infinity
   */
  maxSize?: number

  /**
   * An optional function that will sort the queue after a job has been added
   */
  sort?: Comparator<Job<JobOptions, JobReturnType>>

  /**
   * If false, `.start` will need to be called to start processing jobs
   *
   * @default true
   */
  autoStart?: boolean
}

export type JobStatus = 'queued' | 'running' | 'errored' | 'complete'

export interface RunFunction<Options extends AbortOptions = AbortOptions, ReturnType = void> {
  (options: Options): Promise<ReturnType>
}

export interface JobMatcher<JobOptions extends AbortOptions = AbortOptions> {
  (options?: Partial<JobOptions>): boolean
}

export interface QueueJobSuccess<JobReturnType, JobOptions extends AbortOptions = AbortOptions> {
  job: Job<JobOptions, JobReturnType>
  result: JobReturnType
}

export interface QueueJobFailure<JobReturnType, JobOptions extends AbortOptions = AbortOptions> {
  job: Job<JobOptions, JobReturnType>
  error: Error
}

export interface QueueEvents<JobReturnType, JobOptions extends AbortOptions = AbortOptions> {
  /**
   * A job is about to start running
   */
  active: CustomEvent

  /**
   * All jobs have finished and the queue is empty
   */
  idle: CustomEvent

  /**
   * The queue is empty, jobs may be running
   */
  empty: CustomEvent

  /**
   * A job was added to the queue
   */
  add: CustomEvent

  /**
   * A job has finished or failed
   */
  next: CustomEvent

  /**
   * Emitted just after `"completed", a job has finished successfully - this
   * event gives access to the job and it's result
   */
  success: CustomEvent<QueueJobSuccess<JobReturnType, JobOptions>>

  /**
   * A job has failed - this event gives access to the job and the thrown error
   */
  failure: CustomEvent<QueueJobFailure<JobReturnType, JobOptions>>
}

/**
 * Heavily influence by `p-queue` with the following differences:
 *
 * 1. Items remain at the head of the queue while they are running so `queue.size` includes `queue.pending` items - this is so interested parties can join the results of a queue item while it is running
 * 2. The options for a job are stored separately to the job in order for them to be modified while they are still in the queue
 * 3. If a job's abort signal fires before execution begins, it is removed from the queue immediately
 * 4. 'success'/'failure' events are emitted instead of 'error'/'complete'
 */
export class Queue<JobReturnType = unknown, JobOptions extends AbortOptions = AbortOptions> extends TypedEventEmitter<QueueEvents<JobReturnType, JobOptions>> {
  public concurrency: number
  public maxSize: number
  public queue: Array<Job<JobOptions, JobReturnType>>
  private pending: number
  private readonly sort?: Comparator<Job<JobOptions, JobReturnType>>
  private autoStart: boolean

  constructor (init: QueueInit<JobReturnType, JobOptions> = {}) {
    super()

    this.concurrency = init.concurrency ?? Number.POSITIVE_INFINITY
    this.maxSize = init.maxSize ?? Number.POSITIVE_INFINITY
    this.pending = 0
    this.autoStart = init.autoStart ?? true

    this.sort = init.sort
    this.queue = []

    this.emitEmpty = debounce(this.emitEmpty.bind(this), 1)
    this.emitIdle = debounce(this.emitIdle.bind(this), 1)
  }

  [Symbol.asyncIterator] (): AsyncGenerator<JobReturnType, void, unknown> {
    return this.toGenerator()
  }

  emitEmpty (): void {
    if (this.size !== 0) {
      return
    }

    this.safeDispatchEvent('empty')
  }

  emitIdle (): void {
    if (this.running !== 0) {
      return
    }

    this.safeDispatchEvent('idle')
  }

  private tryToStartAnother (): boolean {
    if (this.size === 0) {
      this.emitEmpty()

      if (this.running === 0) {
        this.emitIdle()
      }

      return false
    }

    if (this.pending < this.concurrency) {
      let job: Job<JobOptions, JobReturnType> | undefined

      for (const j of this.queue) {
        if (j.status === 'queued') {
          job = j
          break
        }
      }

      if (job == null) {
        return false
      }

      this.safeDispatchEvent('active')

      this.pending++

      void job.run()
        .finally(() => {
          // remove the job from the queue
          for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i] === job) {
              this.queue.splice(i, 1)
              break
            }
          }

          this.pending--
          this.safeDispatchEvent('next')
          if (this.autoStart) {
            this.tryToStartAnother()
          }
        })

      return true
    }

    return false
  }

  private enqueue (job: Job<JobOptions, JobReturnType>): void {
    this.queue.push(job)

    if (this.sort != null) {
      this.queue.sort(this.sort)
    }
  }

  /**
   * Start the queue. If the `autoStart` parameter passed to the constructor was
   * not `false` this is a no-op
   */
  start (): void {
    if (this.autoStart !== false) {
      return
    }

    this.autoStart = true
    this.tryToStartAnother()
  }

  /**
   * Prevent further jobs from running - call `.start` to start the queue again
   */
  pause (): void {
    this.autoStart = false
  }

  /**
   * Adds a sync or async task to the queue. Always returns a promise.
   */
  async add (fn: RunFunction<JobOptions, JobReturnType>, options?: JobOptions): Promise<JobReturnType> {
    options?.signal?.throwIfAborted()

    if (this.size === this.maxSize) {
      throw new QueueFullError()
    }

    const job = new Job<JobOptions, JobReturnType>(fn, options)
    this.enqueue(job)
    this.safeDispatchEvent('add')

    if (this.autoStart) {
      this.tryToStartAnother()
    }

    return job.join(options)
      .then(result => {
        this.safeDispatchEvent('success', { detail: { job, result } })

        return result
      })
      .catch(err => {
        if (job.status === 'queued') {
          // job was aborted before it started - remove the job from the queue
          for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i] === job) {
              this.queue.splice(i, 1)
              break
            }
          }
        }

        this.safeDispatchEvent('failure', { detail: { job, error: err } })

        throw err
      })
  }

  /**
   * Clear the queue
   */
  clear (): void {
    this.queue.splice(0, this.queue.length)
  }

  /**
   * Abort all jobs in the queue and clear it
   */
  abort (): void {
    this.queue.forEach(job => {
      job.abort(new AbortError())
    })

    this.clear()
  }

  /**
   * Can be called multiple times. Useful if you for example add additional items at a later time.
   *
   * @returns A promise that settles when the queue becomes empty.
   */
  async onEmpty (options?: AbortOptions): Promise<void> {
    // Instantly resolve if the queue is empty
    if (this.size === 0) {
      return
    }

    await raceEvent(this, 'empty', options?.signal)
  }

  /**
   * @returns A promise that settles when the queue size is less than the given
   * limit: `queue.size < limit`.
   *
   * If you want to avoid having the queue grow beyond a certain size you can
   * `await queue.onSizeLessThan()` before adding a new item.
   *
   * Note that this only limits the number of items waiting to start. There
   * could still be up to `concurrency` jobs already running that this call does
   * not include in its calculation.
   */
  async onSizeLessThan (limit: number, options?: AbortOptions): Promise<void> {
    // Instantly resolve if the queue is empty.
    if (this.size < limit) {
      return
    }

    await raceEvent(this, 'next', options?.signal, {
      filter: () => this.size < limit
    })
  }

  /**
   * The difference with `.onEmpty` is that `.onIdle` guarantees that all work
   * from the queue has finished. `.onEmpty` merely signals that the queue is
   * empty, but it could mean that some promises haven't completed yet.
   *
   * @returns A promise that settles when the queue becomes empty, and all
   * promises have completed; `queue.size === 0 && queue.pending === 0`.
   */
  async onIdle (options?: AbortOptions): Promise<void> {
    // Instantly resolve if none pending and if nothing else is queued
    if (this.pending === 0 && this.size === 0) {
      return
    }

    await raceEvent(this, 'idle', options?.signal)
  }

  /**
   * Size of the queue including running items
   */
  get size (): number {
    return this.queue.length
  }

  /**
   * The number of queued items waiting to run.
   */
  get queued (): number {
    return this.queue.length - this.pending
  }

  /**
   * The number of items currently running.
   */
  get running (): number {
    return this.pending
  }

  /**
   * Returns an async generator that makes it easy to iterate over the results
   * of jobs added to the queue.
   *
   * The generator will end when the queue becomes idle, that is there are no
   * jobs running and no jobs that have yet to run.
   *
   * If you need to keep the queue open indefinitely, consider using it-pushable
   * instead.
   */
  async * toGenerator (options?: AbortOptions): AsyncGenerator<JobReturnType, void, unknown> {
    options?.signal?.throwIfAborted()

    const stream = pushable<JobReturnType>({
      objectMode: true
    })

    const cleanup = (err?: Error): void => {
      if (err != null) {
        this.abort()
      } else {
        this.clear()
      }

      stream.end(err)
    }

    const onQueueJobComplete = (evt: CustomEvent<QueueJobSuccess<JobReturnType, JobOptions>>): void => {
      if (evt.detail != null) {
        stream.push(evt.detail.result)
      }
    }

    const onQueueError = (evt: CustomEvent<QueueJobFailure<JobReturnType, JobOptions>>): void => {
      cleanup(evt.detail.error)
    }

    const onQueueIdle = (): void => {
      cleanup()
    }

    // clear the queue and throw if the query is aborted
    const onSignalAbort = (): void => {
      cleanup(new AbortError('Queue aborted'))
    }

    // add listeners
    this.addEventListener('success', onQueueJobComplete)
    this.addEventListener('failure', onQueueError)
    this.addEventListener('idle', onQueueIdle)
    options?.signal?.addEventListener('abort', onSignalAbort)

    try {
      yield * stream
    } finally {
      // remove listeners
      this.removeEventListener('success', onQueueJobComplete)
      this.removeEventListener('failure', onQueueError)
      this.removeEventListener('idle', onQueueIdle)
      options?.signal?.removeEventListener('abort', onSignalAbort)

      // empty the queue for when the user has broken out of a loop early
      cleanup()
    }
  }
}
