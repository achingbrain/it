## [it-byte-stream-v2.0.2](https://github.com/achingbrain/it/compare/it-byte-stream-2.0.1...it-byte-stream-2.0.2) (2025-05-13)

### Dependencies

* **dev:** bump aegir from 45.2.1 to 46.0.0 ([#160](https://github.com/achingbrain/it/issues/160)) ([0c72e5a](https://github.com/achingbrain/it/commit/0c72e5a14c16439d5d9db75a7a701b21ac6f7290))

## [it-byte-stream-v2.0.1](https://github.com/achingbrain/it/compare/it-byte-stream-2.0.0...it-byte-stream-2.0.1) (2025-03-19)

### Bug Fixes

* update deps ([2ccfa6e](https://github.com/achingbrain/it/commit/2ccfa6e82b9d8ca8f40b0cdbff283414947a3f0e))

## [it-byte-stream-v2.0.0](https://github.com/achingbrain/it/compare/it-byte-stream-1.1.1...it-byte-stream-2.0.0) (2025-03-19)

### ⚠ BREAKING CHANGES

* if the underlying stream closes without yielding any bytes and we are not waiting for a required number of bytes, `byteStream.read` will now return `null` instead of an empty `Uint8ArrayList`
* the `AbortOptions` interface is no longer exported, use the one from `abort-error` instead

### Features

* return null from bytestream when stream closes ([#158](https://github.com/achingbrain/it/issues/158)) ([df88a9d](https://github.com/achingbrain/it/commit/df88a9d903226979f79bfdd59f4eae1906720954))

### Bug Fixes

* remove AbortOptions exports ([#156](https://github.com/achingbrain/it/issues/156)) ([34b18fb](https://github.com/achingbrain/it/commit/34b18fb28bd60d05c98a7d6d41f4f7986a20c144))

## [it-byte-stream-v1.1.1](https://github.com/achingbrain/it/compare/it-byte-stream-1.1.0...it-byte-stream-1.1.1) (2025-03-06)

### Bug Fixes

* update project config ([7cb826e](https://github.com/achingbrain/it/commit/7cb826ed356e8e43b7ffea51727096c2ce87fe21))

### Trivial Changes

* update sibling dependencies ([84e8531](https://github.com/achingbrain/it/commit/84e8531e30b55865afda41509ea7b9f521e6bd73))

### Dependencies

* **dev:** bump aegir from 44.1.4 to 45.0.8 ([#145](https://github.com/achingbrain/it/issues/145)) ([b01501e](https://github.com/achingbrain/it/commit/b01501e36e5085446f459dac95ea91f0304aca1a))

## [it-byte-stream-v1.0.12](https://github.com/achingbrain/it/compare/it-byte-stream-1.0.11...it-byte-stream-1.0.12) (2024-05-30)


### Bug Fixes

* reuse it-queueless-pushable ([#134](https://github.com/achingbrain/it/issues/134)) ([dd24081](https://github.com/achingbrain/it/commit/dd240815f0f89e2473658fed76b85a3ce7beb3af))

## [it-byte-stream-v1.0.11](https://github.com/achingbrain/it/compare/it-byte-stream-1.0.10...it-byte-stream-1.0.11) (2024-05-30)


### Bug Fixes

* unhanded promise rejection in it-byte-stream ([#130](https://github.com/achingbrain/it/issues/130)) ([23bc557](https://github.com/achingbrain/it/commit/23bc557e41904d69c6a8e403854e134768d681f9))


### Trivial Changes

* update to the latest aegir release ([#131](https://github.com/achingbrain/it/issues/131)) ([a20e5b5](https://github.com/achingbrain/it/commit/a20e5b54142fd5c7db19d360f5456a8c2747cc3e))

## it-byte-stream [1.0.10](https://github.com/achingbrain/it/compare/it-byte-stream-1.0.9...it-byte-stream-1.0.10) (2024-04-25)


### Trivial Changes

* update changelogs to new format ([33e243d](https://github.com/achingbrain/it/commit/33e243d6ce096de7fea1d9caf137175d2043ff31))


### Documentation

* update readme files ([#127](https://github.com/achingbrain/it/issues/127)) ([b168296](https://github.com/achingbrain/it/commit/b168296357504d70ec4ec0486d6de166f8ee5446))

## it-byte-stream [1.0.9](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.8...it-byte-stream-1.0.9) (2024-04-24)


### Dependencies

* bump aegir from 41.3.5 to 42.2.5 and update projects ([#121](https://github.com/achingbrain/it/issues/121)) ([cec89b7](https://github.com/achingbrain/it/commit/cec89b7c790bea695b053e3b6b3c255655def1cd))

## it-byte-stream [1.0.8](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.7...it-byte-stream-v1.0.8) (2024-02-07)


### Bug Fixes

* add read/write tests for it-byte-stream ([#119](https://github.com/achingbrain/it/issues/119)) ([7dbdd72](https://github.com/achingbrain/it/commit/7dbdd728ec1277acd92e1d381a1bb73797b8670d))

## it-byte-stream [1.0.7](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.6...it-byte-stream-v1.0.7) (2023-12-11)


### Dependencies

* bump uint8arrays from 4.0.10 to 5.0.0 ([#111](https://github.com/achingbrain/it/issues/111)) ([b0586d0](https://github.com/achingbrain/it/commit/b0586d0d1adf2ecf7a14f53aa8fd8220aaaf78dc))

## it-byte-stream [1.0.6](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.5...it-byte-stream-v1.0.6) (2023-12-02)


### Bug Fixes

* await initial pushable read ([#109](https://github.com/achingbrain/it/issues/109)) ([011fb6b](https://github.com/achingbrain/it/commit/011fb6b6eaf61a39a4ff16fc5392c311cad1aeb1))


### Trivial Changes

* rename master to main ([#108](https://github.com/achingbrain/it/issues/108)) ([86d5c1f](https://github.com/achingbrain/it/commit/86d5c1f2082c79a49ef1e75511abfa7e647fd7b9))

## it-byte-stream [1.0.5](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.4...it-byte-stream-v1.0.5) (2023-11-20)


### Bug Fixes

* add option to yield objects from unwrapped byte stream ([#106](https://github.com/achingbrain/it/issues/106)) ([99e9b82](https://github.com/achingbrain/it/commit/99e9b8242b390703f7c9fa44a7edbb27cee920b8))

## it-byte-stream [1.0.4](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.3...it-byte-stream-v1.0.4) (2023-11-20)


### Bug Fixes

* only overwrite source if readbuffer has bytes ([#105](https://github.com/achingbrain/it/issues/105)) ([bc61c9a](https://github.com/achingbrain/it/commit/bc61c9a2ae69993763c33b0fb5e453e70df45075))

## it-byte-stream [1.0.3](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.2...it-byte-stream-v1.0.3) (2023-11-16)


### Bug Fixes

* use queueless pushable for it-byte-stream outgoing data ([#103](https://github.com/achingbrain/it/issues/103)) ([325b722](https://github.com/achingbrain/it/commit/325b72230ddb3fec9f13e400460731d9ee2d2363))

## it-byte-stream [1.0.2](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.1...it-byte-stream-v1.0.2) (2023-11-15)


### Trivial Changes

* add byte stream benchmark ([#102](https://github.com/achingbrain/it/issues/102)) ([656e54d](https://github.com/achingbrain/it/commit/656e54d0dbf50c3586d4cafab58472b527c9c064))


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#98](https://github.com/achingbrain/it/issues/98)) ([b5d17af](https://github.com/achingbrain/it/commit/b5d17af750dfa2191423dcf06f37b06e5a866ec8))

## it-byte-stream [1.0.1](https://github.com/achingbrain/it/compare/it-byte-stream-v1.0.0...it-byte-stream-v1.0.1) (2023-08-16)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.11 ([#80](https://github.com/achingbrain/it/issues/80)) ([98e17ff](https://github.com/achingbrain/it/commit/98e17ff5f108fce177d98a56c201533a415623e4))

## it-byte-stream-v1.0.0 (2023-07-03)


### Features

* add it-byte-stream, it-length-prefixed-stream and it-protobuf-stream ([#73](https://github.com/achingbrain/it/issues/73)) ([e217bf2](https://github.com/achingbrain/it/commit/e217bf27f1dc1de3272f1273f47e71caa159783a))
