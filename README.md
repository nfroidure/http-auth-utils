# http-auth-utils

> This library provide several utils to parse and build WWW-Authenticate and
 Authorization headers as described per the HTTP RFC.

This library is intended to be framework agnostic and could be used either on
 the server and the client side.

Since this library is in an early development stage, please don't use it until
 you really not care of API changes.

## Development

Running tests:
```sh
npm test
```

Generating docs:
```sh
cat src/index.js src/mecanisms/basic.js src/mecanisms/digest.js | npm run cli -- jsdoc2md > API.md
```

## Contributing

To contribute to this project, you must accept to publish it under the MIT
 Licence.

## Modules
<dl>
<dt><a href="#module_http-auth-utils">http-auth-utils</a></dt>
<dd></dd>
<dt><a href="#module_http-auth-utils/mecanisms/basic">http-auth-utils/mecanisms/basic</a></dt>
<dd></dd>
<dt><a href="#module_http-auth-utils/mecanisms/digest">http-auth-utils/mecanisms/digest</a></dt>
<dd></dd>
</dl>
<a name="module_http-auth-utils"></a>
## http-auth-utils

* [http-auth-utils](#module_http-auth-utils)
  * [.mecanisms](#module_http-auth-utils.mecanisms) : <code>Array</code>
  * [.parseWWWAuthenticateHeader](#module_http-auth-utils.parseWWWAuthenticateHeader) ⇒ <code>Object</code>
  * [.parseAuthorizationHeader](#module_http-auth-utils.parseAuthorizationHeader) ⇒ <code>Object</code>

<a name="module_http-auth-utils.mecanisms"></a>
### http-auth-utils.mecanisms : <code>Array</code>
Natively supported authentication mecanisms.

**Kind**: static constant of <code>[http-auth-utils](#module_http-auth-utils)</code>
**See**: The Basic [http-auth-utils/mecanisms/basic](#module_http-auth-utils/mecanisms/basic) and Digest [http-auth-utils/mecanisms/digest](#module_http-auth-utils/mecanisms/digest)
<a name="module_http-auth-utils.parseWWWAuthenticateHeader"></a>
### http-auth-utils.parseWWWAuthenticateHeader ⇒ <code>Object</code>
Parse HTTP WWW-Authenticate header contents.

**Kind**: static constant of <code>[http-auth-utils](#module_http-auth-utils)</code>
**Returns**: <code>Object</code> - Result of the contents parse.
**Api**: public

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| header | <code>string</code> |  | The WWW-Authenticate header contents |
| [authMecanisms] | <code>Array</code> | <code>[BASIC, DIGEST]</code> | Allow providing custom authentication mecanisms. |

**Example**
```js
assert.equal(
  parseWWWAuthenticateHeader('Basic realm="test"'), {
    type: 'Basic',
    data: {
      realm: 'test'
    }
  }
);
```
<a name="module_http-auth-utils.parseAuthorizationHeader"></a>
### http-auth-utils.parseAuthorizationHeader ⇒ <code>Object</code>
Parse HTTP Authorization header contents.

**Kind**: static constant of <code>[http-auth-utils](#module_http-auth-utils)</code>
**Returns**: <code>Object</code> - Result of the contents parse.
**Api**: public

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| header | <code>string</code> |  | The Authorization header contents |
| [authMecanisms] | <code>Array</code> | <code>[BASIC, DIGEST]</code> | Allow providing custom authentication mecanisms. |

**Example**
```js
assert.equal(
  parseAuthorizationHeader('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
    type: 'Basic',
    data: {
      hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
    }
  }
);
```
<a name="module_http-auth-utils/mecanisms/basic"></a>
## http-auth-utils/mecanisms/basic

* [http-auth-utils/mecanisms/basic](#module_http-auth-utils/mecanisms/basic)
  * [~BASIC](#module_http-auth-utils/mecanisms/basic..BASIC) : <code>Object</code>
    * [.type](#module_http-auth-utils/mecanisms/basic..BASIC.type) : <code>String</code>
    * [.parseWWWAuthenticateRest(rest)](#module_http-auth-utils/mecanisms/basic..BASIC.parseWWWAuthenticateRest) ⇒ <code>Object</code>
    * [.buildWWWAuthenticateRest(content)](#module_http-auth-utils/mecanisms/basic..BASIC.buildWWWAuthenticateRest) ⇒ <code>String</code>
    * [.parseAuthorizationRest(rest)](#module_http-auth-utils/mecanisms/basic..BASIC.parseAuthorizationRest) ⇒ <code>Object</code>
    * [.buildAuthorizationRest(content)](#module_http-auth-utils/mecanisms/basic..BASIC.buildAuthorizationRest) ⇒ <code>String</code>
    * [.computeHash(credentials)](#module_http-auth-utils/mecanisms/basic..BASIC.computeHash) ⇒ <code>String</code>
    * [.decodeHash(hash)](#module_http-auth-utils/mecanisms/basic..BASIC.decodeHash) ⇒ <code>Object</code>

<a name="module_http-auth-utils/mecanisms/basic..BASIC"></a>
### http-auth-utils/mecanisms/basic~BASIC : <code>Object</code>
Basic authentication mecanism.

**Kind**: inner constant of <code>[http-auth-utils/mecanisms/basic](#module_http-auth-utils/mecanisms/basic)</code>
**See**: http://tools.ietf.org/html/rfc2617#section-2

* [~BASIC](#module_http-auth-utils/mecanisms/basic..BASIC) : <code>Object</code>
  * [.type](#module_http-auth-utils/mecanisms/basic..BASIC.type) : <code>String</code>
  * [.parseWWWAuthenticateRest(rest)](#module_http-auth-utils/mecanisms/basic..BASIC.parseWWWAuthenticateRest) ⇒ <code>Object</code>
  * [.buildWWWAuthenticateRest(content)](#module_http-auth-utils/mecanisms/basic..BASIC.buildWWWAuthenticateRest) ⇒ <code>String</code>
  * [.parseAuthorizationRest(rest)](#module_http-auth-utils/mecanisms/basic..BASIC.parseAuthorizationRest) ⇒ <code>Object</code>
  * [.buildAuthorizationRest(content)](#module_http-auth-utils/mecanisms/basic..BASIC.buildAuthorizationRest) ⇒ <code>String</code>
  * [.computeHash(credentials)](#module_http-auth-utils/mecanisms/basic..BASIC.computeHash) ⇒ <code>String</code>
  * [.decodeHash(hash)](#module_http-auth-utils/mecanisms/basic..BASIC.decodeHash) ⇒ <code>Object</code>

<a name="module_http-auth-utils/mecanisms/basic..BASIC.type"></a>
#### BASIC.type : <code>String</code>
The Basic auth mecanism prefix.

**Kind**: static property of <code>[BASIC](#module_http-auth-utils/mecanisms/basic..BASIC)</code>
<a name="module_http-auth-utils/mecanisms/basic..BASIC.parseWWWAuthenticateRest"></a>
#### BASIC.parseWWWAuthenticateRest(rest) ⇒ <code>Object</code>
Parse the WWW Authenticate header rest.

**Kind**: static method of <code>[BASIC](#module_http-auth-utils/mecanisms/basic..BASIC)</code>
**Returns**: <code>Object</code> - Object representing the result of the parse operation.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| rest | <code>String</code> | The header rest (string got after removing the authentication mecanism prefix). |

**Example**
```js
assert.deepEqual(
  BASIC.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
    realm: 'perlinpinpin'
  }
);
```
<a name="module_http-auth-utils/mecanisms/basic..BASIC.buildWWWAuthenticateRest"></a>
#### BASIC.buildWWWAuthenticateRest(content) ⇒ <code>String</code>
Build the WWW Authenticate header rest.

**Kind**: static method of <code>[BASIC](#module_http-auth-utils/mecanisms/basic..BASIC)</code>
**Returns**: <code>String</code> - The built rest.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| content | <code>Object</code> | The content from wich to build the rest. |

**Example**
```js
assert.equal(
  BASIC.buildWWWAuthenticateRest({
    realm: 'perlinpinpin'
  }),
  'realm="perlinpinpin"'
);
```
<a name="module_http-auth-utils/mecanisms/basic..BASIC.parseAuthorizationRest"></a>
#### BASIC.parseAuthorizationRest(rest) ⇒ <code>Object</code>
Parse the Authorization header rest.

**Kind**: static method of <code>[BASIC](#module_http-auth-utils/mecanisms/basic..BASIC)</code>
**Returns**: <code>Object</code> - Object representing the result of the parse operation {hash}.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| rest | <code>String</code> | The header rest (string got after removing the authentication mecanism prefix).) |

**Example**
```js
assert.deepEqual(
  BASIC.parseAuthorizationRest('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
    hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
  }
);
```
<a name="module_http-auth-utils/mecanisms/basic..BASIC.buildAuthorizationRest"></a>
#### BASIC.buildAuthorizationRest(content) ⇒ <code>String</code>
Build the Authorization header rest.

**Kind**: static method of <code>[BASIC](#module_http-auth-utils/mecanisms/basic..BASIC)</code>
**Returns**: <code>String</code> - The rest built.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| content | <code>Object</code> | The content from wich to build the rest. |

**Example**
```js
assert.equal(
  BASIC.buildAuthorizationRest({
    hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
  }),
  'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
);
```
<a name="module_http-auth-utils/mecanisms/basic..BASIC.computeHash"></a>
#### BASIC.computeHash(credentials) ⇒ <code>String</code>
Compute the Basic authentication hash from the given credentials.

**Kind**: static method of <code>[BASIC](#module_http-auth-utils/mecanisms/basic..BASIC)</code>
**Returns**: <code>String</code> - The hash representing the credentials.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>Object</code> | The credentials to encode {username, password}. |

**Example**
```js
assert.equal(
  BASIC.computeHash({
    username: 'Aladdin',
    password: 'open sesame'
  }),
  'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
);
```
<a name="module_http-auth-utils/mecanisms/basic..BASIC.decodeHash"></a>
#### BASIC.decodeHash(hash) ⇒ <code>Object</code>
Decode the Basic hash and return the corresponding credentials.

**Kind**: static method of <code>[BASIC](#module_http-auth-utils/mecanisms/basic..BASIC)</code>
**Returns**: <code>Object</code> - Object representing the credentials {username, password}.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>String</code> | The hash. |

**Example**
```js
assert.deepEqual(
  BASIC.decodeHash('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
    username: 'Aladdin',
    password: 'open sesame'
  }
);
```
<a name="module_http-auth-utils/mecanisms/digest"></a>
## http-auth-utils/mecanisms/digest

* [http-auth-utils/mecanisms/digest](#module_http-auth-utils/mecanisms/digest)
  * [~DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST) : <code>Object</code>
    * [.type](#module_http-auth-utils/mecanisms/digest..DIGEST.type) : <code>String</code>
    * [.parseWWWAuthenticateRest(rest)](#module_http-auth-utils/mecanisms/digest..DIGEST.parseWWWAuthenticateRest) ⇒ <code>Object</code>
    * [.buildWWWAuthenticateRest(content)](#module_http-auth-utils/mecanisms/digest..DIGEST.buildWWWAuthenticateRest) ⇒ <code>String</code>
    * [.parseAuthorizationRest(rest)](#module_http-auth-utils/mecanisms/digest..DIGEST.parseAuthorizationRest) ⇒ <code>Object</code>
    * [.buildAuthorizationRest(content)](#module_http-auth-utils/mecanisms/digest..DIGEST.buildAuthorizationRest) ⇒ <code>String</code>
    * [.computeHash(credentials)](#module_http-auth-utils/mecanisms/digest..DIGEST.computeHash) ⇒ <code>String</code>

<a name="module_http-auth-utils/mecanisms/digest..DIGEST"></a>
### http-auth-utils/mecanisms/digest~DIGEST : <code>Object</code>
Digest authentication mecanism.

**Kind**: inner constant of <code>[http-auth-utils/mecanisms/digest](#module_http-auth-utils/mecanisms/digest)</code>
**See**

- http://tools.ietf.org/html/rfc2617#section-3
- http://tools.ietf.org/html/rfc2069#section-2


* [~DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST) : <code>Object</code>
  * [.type](#module_http-auth-utils/mecanisms/digest..DIGEST.type) : <code>String</code>
  * [.parseWWWAuthenticateRest(rest)](#module_http-auth-utils/mecanisms/digest..DIGEST.parseWWWAuthenticateRest) ⇒ <code>Object</code>
  * [.buildWWWAuthenticateRest(content)](#module_http-auth-utils/mecanisms/digest..DIGEST.buildWWWAuthenticateRest) ⇒ <code>String</code>
  * [.parseAuthorizationRest(rest)](#module_http-auth-utils/mecanisms/digest..DIGEST.parseAuthorizationRest) ⇒ <code>Object</code>
  * [.buildAuthorizationRest(content)](#module_http-auth-utils/mecanisms/digest..DIGEST.buildAuthorizationRest) ⇒ <code>String</code>
  * [.computeHash(credentials)](#module_http-auth-utils/mecanisms/digest..DIGEST.computeHash) ⇒ <code>String</code>

<a name="module_http-auth-utils/mecanisms/digest..DIGEST.type"></a>
#### DIGEST.type : <code>String</code>
The Digest auth mecanism prefix.

**Kind**: static property of <code>[DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST)</code>
<a name="module_http-auth-utils/mecanisms/digest..DIGEST.parseWWWAuthenticateRest"></a>
#### DIGEST.parseWWWAuthenticateRest(rest) ⇒ <code>Object</code>
Parse the WWW Authenticate header rest.

**Kind**: static method of <code>[DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST)</code>
**Returns**: <code>Object</code> - Object representing the result of the parse operation.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| rest | <code>String</code> | The header rest (string got after removing the authentication mecanism prefix). |

**Example**
```js
assert.deepEqual(
  DIGEST.parseWWWAuthenticateRest(
    'realm="testrealm@host.com", ' +
    'qop="auth, auth-int", ' +
    'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
    'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
  ), {
    realm: 'testrealm@host.com',
    qop: 'auth, auth-int',
    nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
    opaque: '5ccc069c403ebaf9f0171e9517f40e41'
  }
);
```
<a name="module_http-auth-utils/mecanisms/digest..DIGEST.buildWWWAuthenticateRest"></a>
#### DIGEST.buildWWWAuthenticateRest(content) ⇒ <code>String</code>
Build the WWW Authenticate header rest.

**Kind**: static method of <code>[DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST)</code>
**Returns**: <code>String</code> - The built rest.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| content | <code>Object</code> | The content from wich to build the rest. |

**Example**
```js
assert.equal(
  DIGEST.buildWWWAuthenticateRest({
    realm: 'testrealm@host.com',
    qop: 'auth, auth-int',
    nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
    opaque: '5ccc069c403ebaf9f0171e9517f40e41'
  }),
  'realm="testrealm@host.com", ' +
  'qop="auth, auth-int", ' +
  'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
  'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
);
```
<a name="module_http-auth-utils/mecanisms/digest..DIGEST.parseAuthorizationRest"></a>
#### DIGEST.parseAuthorizationRest(rest) ⇒ <code>Object</code>
Parse the Authorization header rest.

**Kind**: static method of <code>[DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST)</code>
**Returns**: <code>Object</code> - Object representing the result of the parse operation {hash}.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| rest | <code>String</code> | The header rest (string got after removing the authentication mecanism prefix).) |

**Example**
```js
assert.deepEqual(
  DIGEST.parseAuthorizationRest(
    'username="Mufasa",' +
    'realm="testrealm@host.com",' +
    'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",' +
    'uri="/dir/index.html",' +
    'qop="auth",' +
    'nc="00000001",' +
    'cnonce="0a4f113b",' +
    'response="6629fae49393a05397450978507c4ef1",' +
    'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
  ), {
    username: "Mufasa",
    realm: 'testrealm@host.com',
    nonce: "dcd98b7102dd2f0e8b11d0f600bfb0c093",
    uri: "/dir/index.html",
    qop: 'auth',
    nc: '00000001',
    cnonce: "0a4f113b",
    response: "6629fae49393a05397450978507c4ef1",
    opaque: "5ccc069c403ebaf9f0171e9517f40e41"
  }
);
```
<a name="module_http-auth-utils/mecanisms/digest..DIGEST.buildAuthorizationRest"></a>
#### DIGEST.buildAuthorizationRest(content) ⇒ <code>String</code>
Build the Authorization header rest.

**Kind**: static method of <code>[DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST)</code>
**Returns**: <code>String</code> - The rest built.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| content | <code>Object</code> | The content from wich to build the rest. |

**Example**
```js
assert.equal(
  DIGEST.buildAuthorizationRest({
    username: "Mufasa",
    realm: 'testrealm@host.com',
    nonce: "dcd98b7102dd2f0e8b11d0f600bfb0c093",
    uri: "/dir/index.html",
    qop: 'auth',
    nc: '00000001',
    cnonce: "0a4f113b",
    response: "6629fae49393a05397450978507c4ef1",
    opaque: "5ccc069c403ebaf9f0171e9517f40e41"
  }),
  'username="Mufasa", ' +
  'realm="testrealm@host.com", ' +
  'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
  'uri="/dir/index.html", ' +
  'response="6629fae49393a05397450978507c4ef1", ' +
  'cnonce="0a4f113b", ' +
  'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
  'qop="auth", ' +
  'nc="00000001"'
);
```
<a name="module_http-auth-utils/mecanisms/digest..DIGEST.computeHash"></a>
#### DIGEST.computeHash(credentials) ⇒ <code>String</code>
Compute the Digest authentication hash from the given credentials.

**Kind**: static method of <code>[DIGEST](#module_http-auth-utils/mecanisms/digest..DIGEST)</code>
**Returns**: <code>String</code> - The hash representing the credentials.
**Api**: public

| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>Object</code> | The credentials to encode and other encoding details. |

**Example**
```js
assert.equal(
  DIGEST.computeHash({
    username: 'Mufasa',
    realm: 'testrealm@host.com',
    password: 'Circle Of Life',
    method: 'GET',
    uri: '/dir/index.html',
    nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
    nc: '00000001',
    cnonce: '0a4f113b',
    qop: 'auth',
    algorithm: 'md5'
  }),
  '6629fae49393a05397450978507c4ef1'
);
```
