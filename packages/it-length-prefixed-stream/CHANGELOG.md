## [it-length-prefixed-stream-v2.0.1](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-2.0.0...it-length-prefixed-stream-2.0.1) (2025-03-19)

### Bug Fixes

* update it-byte-stream dep ([13329ba](https://github.com/achingbrain/it/commit/13329ba22308c6149d0faf10f28efdf5563ea6e2))

## [it-length-prefixed-stream-v2.0.0](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-1.2.1...it-length-prefixed-stream-2.0.0) (2025-03-19)

### ⚠ BREAKING CHANGES

* if the underlying stream closes without yielding any bytes and we are not waiting for a required number of bytes, `byteStream.read` will now return `null` instead of an empty `Uint8ArrayList`
* the `AbortOptions` interface is no longer exported, use the one from `abort-error` instead

### Features

* return null from bytestream when stream closes ([#158](https://github.com/achingbrain/it/issues/158)) ([df88a9d](https://github.com/achingbrain/it/commit/df88a9d903226979f79bfdd59f4eae1906720954))

### Bug Fixes

* remove AbortOptions exports ([#156](https://github.com/achingbrain/it/issues/156)) ([34b18fb](https://github.com/achingbrain/it/commit/34b18fb28bd60d05c98a7d6d41f4f7986a20c144))

## [it-length-prefixed-stream-v1.2.1](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-1.2.0...it-length-prefixed-stream-1.2.1) (2025-03-06)

### Bug Fixes

* update project config ([7cb826e](https://github.com/achingbrain/it/commit/7cb826ed356e8e43b7ffea51727096c2ce87fe21))

### Trivial Changes

* update sibling dependencies ([84e8531](https://github.com/achingbrain/it/commit/84e8531e30b55865afda41509ea7b9f521e6bd73))

### Dependencies

* **dev:** bump aegir from 44.1.4 to 45.0.8 ([#145](https://github.com/achingbrain/it/issues/145)) ([b01501e](https://github.com/achingbrain/it/commit/b01501e36e5085446f459dac95ea91f0304aca1a))

## it-length-prefixed-stream [1.1.8](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-1.1.7...it-length-prefixed-stream-1.1.8) (2024-05-26)


### Trivial Changes

* update changelogs to new format ([33e243d](https://github.com/achingbrain/it/commit/33e243d6ce096de7fea1d9caf137175d2043ff31))


### Documentation

* update readme files ([#127](https://github.com/achingbrain/it/issues/127)) ([b168296](https://github.com/achingbrain/it/commit/b168296357504d70ec4ec0486d6de166f8ee5446))

## it-length-prefixed-stream [1.1.7](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.1.6...it-length-prefixed-stream-1.1.7) (2024-04-24)


### Dependencies

* bump aegir from 41.3.5 to 42.2.5 and update projects ([#121](https://github.com/achingbrain/it/issues/121)) ([cec89b7](https://github.com/achingbrain/it/commit/cec89b7c790bea695b053e3b6b3c255655def1cd))



### Dependencies

* **it-byte-stream:** upgraded to 1.0.9

## it-length-prefixed-stream [1.1.6](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.1.5...it-length-prefixed-stream-v1.1.6) (2024-01-16)


### Bug Fixes

* simplify lp stream read/write ([#110](https://github.com/achingbrain/it/issues/110)) ([d3f6059](https://github.com/achingbrain/it/commit/d3f605942064df51371dc540fe7dfb9ead75f195))

## it-length-prefixed-stream [1.1.5](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.1.4...it-length-prefixed-stream-v1.1.5) (2023-12-11)


### Trivial Changes

* rename master to main ([#108](https://github.com/achingbrain/it/issues/108)) ([86d5c1f](https://github.com/achingbrain/it/commit/86d5c1f2082c79a49ef1e75511abfa7e647fd7b9))


### Dependencies

* bump uint8arrays from 4.0.10 to 5.0.0 ([#111](https://github.com/achingbrain/it/issues/111)) ([b0586d0](https://github.com/achingbrain/it/commit/b0586d0d1adf2ecf7a14f53aa8fd8220aaaf78dc))

## it-length-prefixed-stream [1.1.4](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.1.3...it-length-prefixed-stream-v1.1.4) (2023-11-22)


### Bug Fixes

* length-prefixed stream pass opts to byte stream ([#107](https://github.com/achingbrain/it/issues/107)) ([3dfabfa](https://github.com/achingbrain/it/commit/3dfabfa17d89bd6bd18f64642377720159308f0e))

## it-length-prefixed-stream [1.1.3](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.1.2...it-length-prefixed-stream-v1.1.3) (2023-11-20)


### Bug Fixes

* add option to yield objects from unwrapped byte stream ([#106](https://github.com/achingbrain/it/issues/106)) ([99e9b82](https://github.com/achingbrain/it/commit/99e9b8242b390703f7c9fa44a7edbb27cee920b8))

## it-length-prefixed-stream [1.1.2](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.1.1...it-length-prefixed-stream-v1.1.2) (2023-11-20)


### Bug Fixes

* derive max data length length if not passed ([#104](https://github.com/achingbrain/it/issues/104)) ([a4b8561](https://github.com/achingbrain/it/commit/a4b8561b351e377b3b45edce2254956393c1205a))

## it-length-prefixed-stream [1.1.1](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.1.0...it-length-prefixed-stream-v1.1.1) (2023-11-15)


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#98](https://github.com/achingbrain/it/issues/98)) ([b5d17af](https://github.com/achingbrain/it/commit/b5d17af750dfa2191423dcf06f37b06e5a866ec8))

## it-length-prefixed-stream [1.1.0](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.0.2...it-length-prefixed-stream-v1.1.0) (2023-11-12)


### Features

* add `writeV` method to pb and lp streams to batch write ([#101](https://github.com/achingbrain/it/issues/101)) ([4015395](https://github.com/achingbrain/it/commit/40153954baf3816c553ae670935e81b8a0955009))

## it-length-prefixed-stream [1.0.2](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.0.1...it-length-prefixed-stream-v1.0.2) (2023-08-16)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.11 ([#80](https://github.com/achingbrain/it/issues/80)) ([98e17ff](https://github.com/achingbrain/it/commit/98e17ff5f108fce177d98a56c201533a415623e4))

## it-length-prefixed-stream [1.0.1](https://github.com/achingbrain/it/compare/it-length-prefixed-stream-v1.0.0...it-length-prefixed-stream-v1.0.1) (2023-08-16)


### Dependencies

* update uint8-varint to 2.0.0 ([#81](https://github.com/achingbrain/it/issues/81)) ([98ed919](https://github.com/achingbrain/it/commit/98ed919d96116dcad58599791c268d6eebc04c87))

## it-length-prefixed-stream-v1.0.0 (2023-07-03)


### Features

* add it-byte-stream, it-length-prefixed-stream and it-protobuf-stream ([#73](https://github.com/achingbrain/it/issues/73)) ([e217bf2](https://github.com/achingbrain/it/commit/e217bf27f1dc1de3272f1273f47e71caa159783a))


### Dependencies

* update sibling dependencies ([e881375](https://github.com/achingbrain/it/commit/e881375c1352751849908e4638576898f436c4bb))
