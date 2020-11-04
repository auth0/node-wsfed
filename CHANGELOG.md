# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.0.0](https://github.com/auth0/node-wsfed/compare/v5.0.0...v6.0.0) (2020-11-04)


### ⚠ BREAKING CHANGES

* stop supporting node v4, v6 and v8
* update saml dependency to fix vulnerabilities reported by npm

### Features

* update saml dependency to fix vulnerabilities reported by npm ([178c9af](https://github.com/auth0/node-wsfed/commit/178c9afa04921e4c43ca63bd40df6967516e7618))


### Bug Fixes

* remove unused `debug` dev depenency and fix the deprecated usage of express res.send ([0dfb671](https://github.com/auth0/node-wsfed/commit/0dfb6719da5d71fc42b4fa7789d3c569005b9d7c))


### build

* remove node v4, v6 and v8 in travis configuration ([5ffa4c8](https://github.com/auth0/node-wsfed/commit/5ffa4c899a5c8cec3c2e696b0b16c245a0fa95b7))

## [5.0.0](https://github.com/auth0/node-wsfed/compare/v4.0.0...v5.0.0) (2020-10-28)


### ⚠ BREAKING CHANGES

* an error will be returned in case no `nameIdentifier` is returned from the profile mapper

* fix!(nameIdentifier): handle the case of not found nameIdentifier ([615cffd](https://github.com/auth0/node-wsfed/commit/615cffd8544d6f88fc50546abf318c18225014f8))
