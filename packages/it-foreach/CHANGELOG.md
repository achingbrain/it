## [it-foreach-v2.0.5](https://github.com/achingbrain/it/compare/it-foreach-v2.0.4...it-foreach-v2.0.5) (2023-11-12)


### Bug Fixes

* it-foreach should only await thenables ([#100](https://github.com/achingbrain/it/issues/100)) ([265af59](https://github.com/achingbrain/it/commit/265af59dc1c4e873dfb39c5de2af347efa73c5da))

## [it-foreach-v2.0.4](https://github.com/achingbrain/it/compare/it-foreach-v2.0.3...it-foreach-v2.0.4) (2023-08-16)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.11 ([#80](https://github.com/achingbrain/it/issues/80)) ([98e17ff](https://github.com/achingbrain/it/commit/98e17ff5f108fce177d98a56c201533a415623e4))

## [it-foreach-v2.0.3](https://github.com/achingbrain/it/compare/it-foreach-v2.0.2...it-foreach-v2.0.3) (2023-05-09)


### Dependencies

* **dev:** bump aegir from 38.1.8 to 39.0.2 ([#66](https://github.com/achingbrain/it/issues/66)) ([a92bb16](https://github.com/achingbrain/it/commit/a92bb1690e8d584292e37c878d40f437036721a7))

## [it-foreach-v2.0.2](https://github.com/achingbrain/it/compare/it-foreach-v2.0.1...it-foreach-v2.0.2) (2023-03-31)


### Bug Fixes

* yield first mapped/filtered values ([#60](https://github.com/achingbrain/it/issues/60)) ([778a991](https://github.com/achingbrain/it/commit/778a9918b13dd5b8743f34f5cb0a9e256aa2a0b7))

## [it-foreach-v2.0.1](https://github.com/achingbrain/it/compare/it-foreach-v2.0.0...it-foreach-v2.0.1) (2023-03-31)


### Bug Fixes

* allow Iterable | AsyncIterable union input ([#59](https://github.com/achingbrain/it/issues/59)) ([80ec2ac](https://github.com/achingbrain/it/commit/80ec2ace4f64b6291b39cb51bc5ebe2cedba7152))

## [it-foreach-v2.0.0](https://github.com/achingbrain/it/compare/it-foreach-v1.0.1...it-foreach-v2.0.0) (2023-03-30)


### ⚠ BREAKING CHANGES

* if you pass a synchronous iterator to a function it will return a synchronous generator in response

### Bug Fixes

* return iterators from synchronous sources ([#55](https://github.com/achingbrain/it/issues/55)) ([b6d8422](https://github.com/achingbrain/it/commit/b6d84222eb8e6d8c8956810d0e2ec1f065909742))


### Trivial Changes

* update project config, fix broken badges ([#53](https://github.com/achingbrain/it/issues/53)) ([e56c6ae](https://github.com/achingbrain/it/commit/e56c6ae9a0a766b5eab77040e92b2e034ce52d2e))


### Dependencies

* update sibling dependencies ([5f72696](https://github.com/achingbrain/it/commit/5f726968d434a28df6a4864b0314e8c49cab08dd))
* update sibling dependencies ([8b60209](https://github.com/achingbrain/it/commit/8b60209d429e282f8d5e5218ee2019ae7153585b))

## [it-foreach-v1.0.1](https://github.com/achingbrain/it/compare/it-foreach-v1.0.0...it-foreach-v1.0.1) (2023-03-02)


### Dependencies

* **dev:** bump aegir from 37.12.1 to 38.1.6 ([#45](https://github.com/achingbrain/it/issues/45)) ([2c8139e](https://github.com/achingbrain/it/commit/2c8139ef060efa72c386aa3863e6c575f6f199e5))

## [it-foreach-v1.0.0](https://github.com/achingbrain/it/compare/it-foreach-v0.1.1...it-foreach-v1.0.0) (2022-10-17)


### ⚠ BREAKING CHANGES

* all modules are now published as ESM-only

### Features

* convert to typescript ([#28](https://github.com/achingbrain/it/issues/28)) ([f8a38bf](https://github.com/achingbrain/it/commit/f8a38bfb1b902e8101f1077eb33c3cea49819464))


### Dependencies

* update sibling dependencies ([1415cdd](https://github.com/achingbrain/it/commit/1415cdd019f32c08b1024e60bf3816619e361938))
