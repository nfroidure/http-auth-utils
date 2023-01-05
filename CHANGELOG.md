## [3.0.5](https://github.com/nfroidure/http-auth-utils/compare/v3.0.4...v3.0.5) (2023-01-05)



## [3.0.4](https://github.com/nfroidure/http-auth-utils/compare/v3.0.3...v3.0.4) (2022-09-01)



## [3.0.3](https://github.com/nfroidure/http-auth-utils/compare/v3.0.2...v3.0.3) (2022-05-25)



## [3.0.2](https://github.com/nfroidure/http-auth-utils/compare/v3.0.1...v3.0.2) (2021-12-15)


### Bug Fixes

* **src/utils.ts:** handle parsing non-quoted values in authenticate header ([772608e](https://github.com/nfroidure/http-auth-utils/commit/772608e037da2385e1f6ba5035146ab4d945af6b)), closes [#10](https://github.com/nfroidure/http-auth-utils/issues/10)



## [3.0.1](https://github.com/nfroidure/http-auth-utils/compare/v3.0.0...v3.0.1) (2021-04-09)



# [3.0.0](https://github.com/nfroidure/http-auth-utils/compare/v2.6.0...v3.0.0) (2020-12-06)


### Code Refactoring

* **types:** convert code to typescript ([0b7f30b](https://github.com/nfroidure/http-auth-utils/commit/0b7f30be45c0e79f83115515091f85f68dc3e98d)), closes [#4](https://github.com/nfroidure/http-auth-utils/issues/4)


### BREAKING CHANGES

* **types:** Last supported LTS



# [2.6.0](https://github.com/nfroidure/http-auth-utils/compare/v2.5.0...v2.6.0) (2020-09-15)



# [2.5.0](https://github.com/nfroidure/http-auth-utils/compare/v2.4.0...v2.5.0) (2020-04-01)



# [2.4.0](https://github.com/nfroidure/http-auth-utils/compare/v2.3.0...v2.4.0) (2020-01-19)



# [2.3.0](https://github.com/nfroidure/http-auth-utils/compare/v2.2.0...v2.3.0) (2019-12-02)


### Features

* **parsers:** allow to parse header less strictly ([060c805](https://github.com/nfroidure/http-auth-utils/commit/060c8054a9a074ec376318a9ac49771233f3a89d))



# [2.2.0](https://github.com/nfroidure/http-auth-utils/compare/v2.1.0...v2.2.0) (2019-03-07)


### Features

* **buildAuthorizationHeader:** dd a way to build Authorization headers too ([1294584](https://github.com/nfroidure/http-auth-utils/commit/1294584))
* **buildWWWAuthenticateHeader:** Add a way to build WWW Authenticate headers too ([cc51ac1](https://github.com/nfroidure/http-auth-utils/commit/cc51ac1))



# [2.1.0](https://github.com/nfroidure/http-auth-utils/compare/v2.0.0...v2.1.0) (2019-02-14)


### Features

* **Types:** Add TypeScript types ([9f5d413](https://github.com/nfroidure/http-auth-utils/commit/9f5d413))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/nfroidure/http-auth-utils/compare/v1.0.1...v2.0.0) (2018-08-30)


### Bug Fixes

* **Root modules:** Fix exportation of root modules ([0ae79ee](https://github.com/nfroidure/http-auth-utils/commit/0ae79ee))


### Code Refactoring

* **Typo:** Fix the mechanism typo ([d2ebdde](https://github.com/nfroidure/http-auth-utils/commit/d2ebdde))


### BREAKING CHANGES

* **Typo:** The mechanism word replaced the bad mecanism one everywhere



<a name="1.0.1"></a>
## [1.0.1](https://github.com/nfroidure/http-auth-utils/compare/v1.0.0...v1.0.1) (2017-12-04)




### upcoming (2017/03/04 15:33 +00:00)
- [ae47241](https://github.com/nfroidure/http-auth-utils/commit/ae4724123a06493ee72c91e7c5f448dde280440c) Add metapak-nfroidure (@nfroidure)
- [fed5174](https://github.com/nfroidure/http-auth-utils/commit/fed5174fe0981f1aa69731bd95935a76d35c2dad) Removing Node7 (@nfroidure)
- [90ec228](https://github.com/nfroidure/http-auth-utils/commit/90ec2282cf3c5446d168aa7dde530bf478aaf3a5) Adding the travis conf file (@nfroidure)
- [81b94ba](https://github.com/nfroidure/http-auth-utils/commit/81b94bae0e2ddc8d02e985f31edf580e0b9a987f) Updating documentation (@nfroidure)

### v1.0.0 (2016/07/19 14:32 +00:00)
- [4413c6c](https://github.com/nfroidure/http-auth-utils/commit/4413c6cad1a6f6eca3247d0fbe90a2aa63c857b4) 1.0.0 (@nfroidure)
- [ed5b186](https://github.com/nfroidure/http-auth-utils/commit/ed5b186b986319ba332da8bb273428f6924e2b30) Compiling dist files (@nfroidure)
- [5fac255](https://github.com/nfroidure/http-auth-utils/commit/5fac255a19dcf011f54d97709c4ced2d530afc2e) Upgrading the linting config and fixing new issues (@nfroidure)
- [37bba01](https://github.com/nfroidure/http-auth-utils/commit/37bba0186d1f41d2f7ca5006767416c3e7169ee2) Adding badges :D (@nfroidure)
- [25a4167](https://github.com/nfroidure/http-auth-utils/commit/25a4167dd5b500291bbfaf69aed4d2ed5dbc9dd2) * neemzy:   Adding the Bearer mecanism   Adding a linter and code coveraging   Fixing issue with ":" in the password of basic auth   Adding more Basic tests   fixed Aladdin to Ali Baba (@nfroidure)
- [98861f2](https://github.com/nfroidure/http-auth-utils/commit/98861f253298564d80c4ad9a6bf2d54a1042dead) Adding the Bearer mecanism (@nfroidure)
- [dfd620d](https://github.com/nfroidure/http-auth-utils/commit/dfd620d4d2c7c0dc5c6a9f6a6f68e7e3bbe0d577) Adding a linter and code coveraging (@nfroidure)
- [5ae4199](https://github.com/nfroidure/http-auth-utils/commit/5ae4199c10c1b783286f5875a00cb35703a49583) Fixing issue with ":" in the password of basic auth (@nfroidure)
- [b7bbacb](https://github.com/nfroidure/http-auth-utils/commit/b7bbacb471b7ed823f933137e5077fd15dbee48c) Adding more Basic tests (@nfroidure)
- [6ca6692](https://github.com/nfroidure/http-auth-utils/commit/6ca6692ad911c9ac9d53532e50ea2ad423348287) Adding the Bearer mecanism (@nfroidure)
- [f2c479c](https://github.com/nfroidure/http-auth-utils/commit/f2c479ce45581775b956b4ba813fa17c7257893b) Adding a linter and code coveraging (@nfroidure)
- [e39e3c9](https://github.com/nfroidure/http-auth-utils/commit/e39e3c9bc39b3058b0c5903e2b5d7c0b0f8a8393) Fixing issue with ":" in the password of basic auth (@nfroidure)
- [ee98383](https://github.com/nfroidure/http-auth-utils/commit/ee98383b67e156a0b387100bfe3a767ece95b68d) Adding more Basic tests (@nfroidure)
- [2afff99](https://github.com/nfroidure/http-auth-utils/commit/2afff99ce92ecc34bcd47283c4e8d14cbe321246) fixed Aladdin to Ali Baba (@neemzy)

### v0.0.2 (2015/06/01 08:42 +00:00)
- [9f8df22](https://github.com/nfroidure/http-auth-utils/commit/9f8df2217c6e583e77f599e54ff841b977e8f4d2) 0.0.2 (@nfroidure)
- [4e69844](https://github.com/nfroidure/http-auth-utils/commit/4e698448257529f7b6d1e8a7bf04dcb7fed3a4bd) Parsing the hash only make no sense and creates inconsistency between BASIC and DIGEST usage in userland code since the username is often needed (@nfroidure)
- [30a6c37](https://github.com/nfroidure/http-auth-utils/commit/30a6c377b442bce02e7635a8ede09f32f0fa0902) Updating docs (@nfroidure)
- [137b09c](https://github.com/nfroidure/http-auth-utils/commit/137b09c6aa5c99667bef50d9267ec9425516de64) Also export mecanisms per their identifiers (@nfroidure)

### v0.0.1 (2015/05/31 20:40 +00:00)
- [4cd1838](https://github.com/nfroidure/http-auth-utils/commit/4cd1838c8e63d6ee68ce4ad00c830806f63645cd) 0.0.1 (@nfroidure)
- [d0c8247](https://github.com/nfroidure/http-auth-utils/commit/d0c824790da095e5d49e5f2b5d248d47e47ed277) Adding jsdoc (@nfroidure)
- [7ed78db](https://github.com/nfroidure/http-auth-utils/commit/7ed78dbac99f69770a9f973ef3748e15206dfc96) Fixing digest importation (@nfroidure)
- [8853def](https://github.com/nfroidure/http-auth-utils/commit/8853def62424dad527aa583964becc6797a23387) Export DIGEST and BASIC mecanisms at the module level (@nfroidure)
- [fbbf44b](https://github.com/nfroidure/http-auth-utils/commit/fbbf44b8de76b7aa64fcc828ca598fb843ecc09d) Add new files (@nfroidure)
- [2d5cd82](https://github.com/nfroidure/http-auth-utils/commit/2d5cd82dc7ff45cf6cd54f0f7088e3dccf53edee) Adding some top level functions (@nfroidure)
- [9a9d225](https://github.com/nfroidure/http-auth-utils/commit/9a9d225f867a0e061868da32c65f01dbc3b9c631) Adding a simple readme file (@nfroidure)
- [65b080d](https://github.com/nfroidure/http-auth-utils/commit/65b080db4a19d46bc531809000d2c50ec6ec8a37) No longer decoding MD5 hash for basic authentication mecanism (@nfroidure)
- [5b439fb](https://github.com/nfroidure/http-auth-utils/commit/5b439fbe367899acaa32dc5df80ce91296f87cb1) Adding a way to compute hash and finalizing digest mecanism (@nfroidure)
- [9214345](https://github.com/nfroidure/http-auth-utils/commit/921434534bf65a2f8873db3b2e51f0d9d5642f36) Adding a way to also serialise (@nfroidure)
- [3b29475](https://github.com/nfroidure/http-auth-utils/commit/3b294750a62b4d6d269a4e8c5416c6289edfa3cb) Adding a way to also serialise (@nfroidure)
- [7d0ed99](https://github.com/nfroidure/http-auth-utils/commit/7d0ed99d53ccb8a2015e4ba6e5787d648c612ab2) Adding a way to parse quoted headers (@nfroidure)
