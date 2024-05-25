import undefinedTransformer from './1024-undefined.js'
import nullTransformer from './1025-null.js'
import booleanTransformer from './1026-boolean.js'
import numberTransformer from './1027-number.js'
import stringTransformer from './1028-string.js'
import arrayTransformer from './1029-array.js'
import functionTransformer from './1030-function.js'
import nanTransformer from './1031-nan.js'
import errorTransformer from './1032-error.js'
import promiseTransformer from './1033-promise.js'
import asyncGeneratorTransformer from './1034-async-generator.js'
import bigIntTransformer from './1035-bigint.js'
import mapTransformer from './1036-map.js'
import setTransformer from './1037-set.js'
import uint8ArrayTransformer from './1038-uint8array.js'
import abortSignalTransformer from './1039-abort-signal.js'
import dateTransformer from './1040-date.js'
import regExpTransformer from './1041-regexp.js'
import objectTransformer from './2147483647-object.js'
import type { ValueCodec } from '../index.js'

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
