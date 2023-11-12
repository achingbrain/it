import { duplexPair } from 'it-pair/duplex'
import { lpStream } from '../dist/src/index.js'

const DATA_LENGTH = 1024 * 1024 * 1024
const CHUNK_SIZE = 256 * 1024
const ITERATIONS = 10

const results = []

for (let i = 0; i < ITERATIONS; i++) {
  const duplex = duplexPair()
  const inputStream = lpStream(duplex[0])
  const outputStream = lpStream(duplex[1])
  let read = 0

  const start = Date.now()

  while (read < DATA_LENGTH) {
    const bufs = new Array(5).fill(0).map(() => new Uint8Array(CHUNK_SIZE))

    await inputStream.writeV(
      bufs
    )

    const buf = await outputStream.read()

    read += buf.byteLength
  }

  const finish = Date.now() - start
  results.push(finish)
}

const megs = DATA_LENGTH / (1024 * 1024)
const secs = (results.reduce((acc, curr) => acc + curr, 0) / results.length) / 1000

// eslint-disable-next-line no-console
console.info((megs / secs).toFixed(2), 'MB/s')
