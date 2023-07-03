import type { LengthDecoderFunction } from 'it-length-prefixed'

export const int32BEDecode: LengthDecoderFunction = (data) => {
  if (data.length < 4) {
    throw RangeError('Could not decode int32BE')
  }

  return data.getInt32(0, false)
}
int32BEDecode.bytes = 4 // Always because fixed length
