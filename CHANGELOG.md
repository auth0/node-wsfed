# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [7.0.0]

### ⚠ BREAKING CHANGES

- Stops support for node versions < 12
- When using signed JWT assertions (https://github.com/auth0/node-wsfed#jwt), new restrictions apply. See ([jsonwebtokenv9.0.0]https://github.com/auth0/node-jsonwebtoken/wiki/Migration-Notes:-v8-to-v9). In particular: 
  - RSA key size must be 2048 bits or greater. (unless the not recommended and insecure option jwtAllowInsecureKeySizes is used)
  - Asymmetric keys cannot be used to sign HMAC tokens.
  - Key types must be valid for the signing algorithm (unless the not recommended and insecure option jwtAllowInvalidAsymmetricKeyTypes is used)


### Security

* upgrades jsonwebtoken to version 9.0.0, fixing JWT signing vulnerabilities ([GHSA-8cf7-32gw-wr33]https://github.com/auth0/node-jsonwebtoken/security/advisories/GHSA-8cf7-32gw-wr33). 

## [6.1.0](https://github.com/auth0/node-wsfed/compare/v6.0.0...v6.1.0) (2021-02-12)


### Features

* adding support for name identifier format option ([2228a7a](https://github.com/auth0/node-wsfed/commit/2228a7afd44ffbbb139e32954265d0c30dc87a36))


### Bug Fixes

* add back support for custom profile mapper for nameIdentifierFormat ([c0d932b](https://github.com/auth0/node-wsfed/commit/c0d932bb2a3ce0d38dbf33f1a619398265ff81d0))
* make xtend a production dependency ([26f3dc4](https://github.com/auth0/node-wsfed/commit/26f3dc411bb07fa492041e3fea6aeda5e96977f2))

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
