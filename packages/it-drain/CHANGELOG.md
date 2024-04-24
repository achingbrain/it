## it-drain [3.0.6](https://github.com/achingbrain/it/compare/it-drain-v3.0.5...it-drain-3.0.6) (2024-04-24)


### Trivial Changes

* rename master to main ([#108](https://github.com/achingbrain/it/issues/108)) ([86d5c1f](https://github.com/achingbrain/it/commit/86d5c1f2082c79a49ef1e75511abfa7e647fd7b9))


### Dependencies

* bump aegir from 41.3.5 to 42.2.5 and update projects ([#121](https://github.com/achingbrain/it/issues/121)) ([cec89b7](https://github.com/achingbrain/it/commit/cec89b7c790bea695b053e3b6b3c255655def1cd))

## it-drain [3.0.5](https://github.com/achingbrain/it/compare/it-drain-v3.0.4...it-drain-v3.0.5) (2023-11-15)


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#98](https://github.com/achingbrain/it/issues/98)) ([b5d17af](https://github.com/achingbrain/it/commit/b5d17af750dfa2191423dcf06f37b06e5a866ec8))

## it-drain [3.0.4](https://github.com/achingbrain/it/compare/it-drain-v3.0.3...it-drain-v3.0.4) (2023-11-12)


### Dependencies

* **dev:** bump delay from 5.0.0 to 6.0.0 ([#68](https://github.com/achingbrain/it/issues/68)) ([cf8dc98](https://github.com/achingbrain/it/commit/cf8dc98bc22c9baf22a3620d08c04db6b3f99f6a))

## it-drain [3.0.3](https://github.com/achingbrain/it/compare/it-drain-v3.0.2...it-drain-v3.0.3) (2023-08-16)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.11 ([#80](https://github.com/achingbrain/it/issues/80)) ([98e17ff](https://github.com/achingbrain/it/commit/98e17ff5f108fce177d98a56c201533a415623e4))

## it-drain [3.0.2](https://github.com/achingbrain/it/compare/it-drain-v3.0.1...it-drain-v3.0.2) (2023-05-09)


### Dependencies

* **dev:** bump aegir from 38.1.8 to 39.0.2 ([#66](https://github.com/achingbrain/it/issues/66)) ([a92bb16](https://github.com/achingbrain/it/commit/a92bb1690e8d584292e37c878d40f437036721a7))

## it-drain [3.0.1](https://github.com/achingbrain/it/compare/it-drain-v3.0.0...it-drain-v3.0.1) (2023-03-31)


### Bug Fixes

* allow Iterable | AsyncIterable union input ([#59](https://github.com/achingbrain/it/issues/59)) ([80ec2ac](https://github.com/achingbrain/it/commit/80ec2ace4f64b6291b39cb51bc5ebe2cedba7152))

## it-drain [3.0.0](https://github.com/achingbrain/it/compare/it-drain-v2.0.1...it-drain-v3.0.0) (2023-03-30)


### ⚠ BREAKING CHANGES

* if you pass a synchronous iterator to a function it will return a synchronous generator in response

### Bug Fixes

* return iterators from synchronous sources ([#55](https://github.com/achingbrain/it/issues/55)) ([b6d8422](https://github.com/achingbrain/it/commit/b6d84222eb8e6d8c8956810d0e2ec1f065909742))


### Trivial Changes

* update project config, fix broken badges ([#53](https://github.com/achingbrain/it/issues/53)) ([e56c6ae](https://github.com/achingbrain/it/commit/e56c6ae9a0a766b5eab77040e92b2e034ce52d2e))

## it-drain [2.0.1](https://github.com/achingbrain/it/compare/it-drain-v2.0.0...it-drain-v2.0.1) (2023-03-02)


### Dependencies

* **dev:** bump aegir from 37.12.1 to 38.1.6 ([#45](https://github.com/achingbrain/it/issues/45)) ([2c8139e](https://github.com/achingbrain/it/commit/2c8139ef060efa72c386aa3863e6c575f6f199e5))

## it-drain [2.0.0](https://github.com/achingbrain/it/compare/it-drain-v1.0.5...it-drain-v2.0.0) (2022-10-17)


### ⚠ BREAKING CHANGES

* all modules are now published as ESM-only

### Features

* convert to typescript ([#28](https://github.com/achingbrain/it/issues/28)) ([f8a38bf](https://github.com/achingbrain/it/commit/f8a38bfb1b902e8101f1077eb33c3cea49819464))
