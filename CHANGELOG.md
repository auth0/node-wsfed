# [8.0.0](https://github.com/auth0/node-wsfed/compare/v7.0.3...v8.0.0) (2026-03-31)


### Features

* add encryption algorithm options ([#47](https://github.com/auth0/node-wsfed/issues/47)) ([5f53685](https://github.com/auth0/node-wsfed/commit/5f53685feeb4f07c5b87a2da7d1b1e791fe94c3a))


### BREAKING CHANGES

* adding encryption algorithm in options(if not set, defaults to http://www.w3.org/2009/xmlenc11#aes256-gcm), adding disallowEncryptionWithInsecureAlgorithm to enforce secure encryption algorithms
## [7.0.3](https://github.com/auth0/node-wsfed/compare/v7.0.2...v7.0.3) (2026-03-16)


### Bug Fixes

* update dist files ([#44](https://github.com/auth0/node-wsfed/issues/44)) ([df07247](https://github.com/auth0/node-wsfed/commit/df072479ec46983e4ce9e26fb5cc651fc170008b))
## [7.0.2](https://github.com/auth0/node-wsfed/compare/v7.0.1...v7.0.2) (2026-03-11)


### Chore

* add semantic-release automation ([#36](https://github.com/auth0/node-wsfed/issues/36)) ([d3cc1ea](https://github.com/auth0/node-wsfed/commit/d3cc1eae2e494279b78745237c6d1177b8271d41))
### [7.0.1](https://github.com/auth0/node-wsfed/compare/v7.0.0...v7.0.1) (2025-05-08)


### Bug Fixes

* update ejs to 3.1.10 ([#32](https://github.com/auth0/node-wsfed/issues/32)) ([bf73fff](https://github.com/auth0/node-wsfed/commit/bf73fff7fa06903c7fc35cc8fdcb72cc249334c0))
* update saml to 3.0.1 ([#33](https://github.com/auth0/node-wsfed/issues/33)) ([eb0dede](https://github.com/auth0/node-wsfed/commit/eb0dede47d5d52bfd83d809d8f11db111e6dffd0))

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
