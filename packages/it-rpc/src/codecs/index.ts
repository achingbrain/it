import undefinedTransformer from './1024-undefined.ts'
import nullTransformer from './1025-null.ts'
import booleanTransformer from './1026-boolean.ts'
import numberTransformer from './1027-number.ts'
import stringTransformer from './1028-string.ts'
import arrayTransformer from './1029-array.ts'
import functionTransformer from './1030-function.ts'
import nanTransformer from './1031-nan.ts'
import errorTransformer from './1032-error.ts'
import promiseTransformer from './1033-promise.ts'
import asyncGeneratorTransformer from './1034-async-generator.ts'
import bigIntTransformer from './1035-bigint.ts'
import mapTransformer from './1036-map.ts'
import setTransformer from './1037-set.ts'
import uint8ArrayTransformer from './1038-uint8array.ts'
import abortSignalTransformer from './1039-abort-signal.ts'
import dateTransformer from './1040-date.ts'
import regExpTransformer from './1041-regexp.ts'
import objectTransformer from './2147483647-object.ts'
import type { ValueCodec } from '../index.ts'

export const defaultTransformers: ValueCodec[] = [
  undefinedTransformer,
  nullTransformer,
  booleanTransformer,
  numberTransformer,
  stringTransformer,
  arrayTransformer,
  functionTransformer,
  nanTransformer,
  errorTransformer,
  promiseTransformer,
  asyncGeneratorTransformer,
  bigIntTransformer,
  mapTransformer,
  setTransformer,
  uint8ArrayTransformer,
  abortSignalTransformer,
  dateTransformer,
  regExpTransformer,
  objectTransformer
]
