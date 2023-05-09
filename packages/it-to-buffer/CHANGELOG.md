## [it-to-buffer-v4.0.2](https://github.com/achingbrain/it/compare/it-to-buffer-v4.0.1...it-to-buffer-v4.0.2) (2023-05-09)


### Dependencies

* **dev:** bump aegir from 38.1.8 to 39.0.2 ([#66](https://github.com/achingbrain/it/issues/66)) ([a92bb16](https://github.com/achingbrain/it/commit/a92bb1690e8d584292e37c878d40f437036721a7))

## [it-to-buffer-v4.0.1](https://github.com/achingbrain/it/compare/it-to-buffer-v4.0.0...it-to-buffer-v4.0.1) (2023-03-31)


### Bug Fixes

* allow Iterable | AsyncIterable union input ([#59](https://github.com/achingbrain/it/issues/59)) ([80ec2ac](https://github.com/achingbrain/it/commit/80ec2ace4f64b6291b39cb51bc5ebe2cedba7152))

## [it-to-buffer-v4.0.0](https://github.com/achingbrain/it/compare/it-to-buffer-v3.0.1...it-to-buffer-v4.0.0) (2023-03-30)


### ⚠ BREAKING CHANGES

* if you pass a synchronous iterator to a function it will return a synchronous generator in response

### Bug Fixes

* return iterators from synchronous sources ([#55](https://github.com/achingbrain/it/issues/55)) ([b6d8422](https://github.com/achingbrain/it/commit/b6d84222eb8e6d8c8956810d0e2ec1f065909742))


### Trivial Changes

* update project config, fix broken badges ([#53](https://github.com/achingbrain/it/issues/53)) ([e56c6ae](https://github.com/achingbrain/it/commit/e56c6ae9a0a766b5eab77040e92b2e034ce52d2e))

## [it-to-buffer-v3.0.1](https://github.com/achingbrain/it/compare/it-to-buffer-v3.0.0...it-to-buffer-v3.0.1) (2023-03-02)


### Dependencies

* **dev:** bump aegir from 37.12.1 to 38.1.6 ([#45](https://github.com/achingbrain/it/issues/45)) ([2c8139e](https://github.com/achingbrain/it/commit/2c8139ef060efa72c386aa3863e6c575f6f199e5))

## [it-to-buffer-v3.0.0](https://github.com/achingbrain/it/compare/it-to-buffer-v2.0.2...it-to-buffer-v3.0.0) (2022-10-17)


### ⚠ BREAKING CHANGES

* all modules are now published as ESM-only

### Features

* convert to typescript ([#28](https://github.com/achingbrain/it/issues/28)) ([f8a38bf](https://github.com/achingbrain/it/commit/f8a38bfb1b902e8101f1077eb33c3cea49819464))
