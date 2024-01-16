import type { Uint8ArrayList } from 'uint8arraylist'

export function int32BEDecode (data: Uint8ArrayList): number {
  if (data.length < 4) {
    throw RangeError('Could not decode int32BE')
  }

  return data.getInt32(0, false)
}
