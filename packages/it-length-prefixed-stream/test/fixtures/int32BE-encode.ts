import { Uint8ArrayList } from 'uint8arraylist'

export function int32BEEncode (value: number): Uint8ArrayList {
  const data = new Uint8ArrayList(
    new Uint8Array(4)
  )
  data.setInt32(0, value, false)

  return data
}
