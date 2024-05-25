import { defaultTransformers } from './codecs/index.js'
import { UnsupportedValueTypeError } from './errors.js'
import type { ValueCodec, Invocation } from './index.js'
import type { Value } from './rpc.js'
import type { Pushable } from 'it-pushable'

export interface ValuesInit {
  valueCodecs?: ValueCodec[]
}

export class Values {
  private readonly transformersMap: Record<number, ValueCodec>
  private readonly transformersList: ValueCodec[]

  constructor (init?: ValuesInit) {
    this.transformersList = [
      ...defaultTransformers,
      ...(init?.valueCodecs ?? [])
    ].sort((a, b) => {
      if (a.type < b.type) {
        return -1
      }

      if (a.type > b.type) {
        return 1
      }

      return 0
    })

    this.transformersMap = {}

    // create lookup map, throw on duplicates
    this.transformersList.forEach(transformer => {
      if (this.transformersMap[transformer.type] != null) {
        throw new Error(`Duplicate transformer type ${transformer.type}`)
      }

      this.transformersMap[transformer.type] = transformer
    })
  }

  public toValue (val: any, context?: any, invocation?: Invocation): Value {
    for (let i = 0; i < this.transformersList.length; i++) {
      const transformer = this.transformersList[i]

      if (transformer.canEncode(val)) {
        return {
          type: transformer.type,
          value: transformer.encode?.(val, this, context, invocation)
        }
      }
    }

    throw new UnsupportedValueTypeError(`Unsupported value type "${val}"`)
  }

  public fromValue (val: Value, pushable: Pushable<Uint8Array>, invocation: Invocation): any {
    const transformer = this.transformersMap[val.type]

    if (transformer == null) {
      throw new UnsupportedValueTypeError(`Unsupported value type "${val.type}"`)
    }

    return transformer.decode(val.value ?? new Uint8Array(0), this, pushable, invocation)
  }
}
