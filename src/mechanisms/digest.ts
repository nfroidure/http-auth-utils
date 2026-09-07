/**
 * @module http-auth-utils/mechanisms/digest
 */

import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet,
  type AllowedValues,
} from '../utils.js';

import crypto from 'crypto';

const REQUIRED_WWW_AUTHENTICATE_KEYS = ['realm', 'nonce'];
const AUTHORIZED_WWW_AUTHENTICATE_KEYS = [
  ...REQUIRED_WWW_AUTHENTICATE_KEYS,
  'domain',
  'opaque',
  'stale',
  'algorithm',
  'qop',
  'charset',
  'userhash',
];
const UNQUOTED_WWW_AUTHENTICATE_KEYS = [
  'stale',
  'algorithm',
  'charset',
  'userhash',
];

export type DigestAlgorithm =
  | 'MD5'
  | 'MD5-sess'
  | 'SHA-256'
  | 'SHA-256-sess'
  | 'SHA-512-256'
  | 'SHA-512-256-sess'
  | string;
export type DigestQOP = 'auth' | 'auth-int' | string;

export interface DigestWWWAuthenticateData {
  realm: string;
  domain?: string;
  nonce: string;
  opaque?: string;
  stale?: 'true' | 'false';
  algorithm?: DigestAlgorithm;
  qop?: string;
  charset?: 'UTF-8';
  userhash?: 'true' | 'false';
}
const REQUIRED_AUTHORIZATION_KEYS = [
  'username',
  'realm',
  'nonce',
  'uri',
  'response',
];
const AUTHORIZED_AUTHORIZATION_KEYS = [
  ...REQUIRED_AUTHORIZATION_KEYS,
  'algorithm',
  'cnonce',
  'opaque',
  'qop',
  'nc',
  'userhash',
];
const UNQUOTED_AUTHORIZATION_KEYS = ['algorithm', 'qop', 'nc', 'userhash'];
const ALLOWED_VALUES: AllowedValues = {
  charset: {
    caseInsensitive: true,
    values: ['UTF-8'],
  },
  userhash: {
    caseInsensitive: true,
    values: ['true', 'false'],
  },
  stale: {
    caseInsensitive: true,
    values: ['true', 'false'],
  },
  nc: {
    regExp: /[0-F]{8}/i,
  },
};

export interface DigestAuthorizationData {
  username: string;
  realm: string;
  nonce: string;
  uri: string;
  response: string;
  algorithm?: DigestAlgorithm;
  cnonce?: string;
  opaque?: string;
  qop?: DigestQOP;
  nc?: string;
  userhash?: 'true' | 'false';
}

/* Architecture Note #1.3: Digest mechanism

See [RFC 2617](https://tools.ietf.org/html/rfc2617) and
[RFC 7616](https://httpwg.org/specs/rfc7616.html)].

*/

/**
 * Digest authentication mechanism.
 * @type {Object}
 * @see http://tools.ietf.org/html/rfc2617#section-3
 * @see http://tools.ietf.org/html/rfc2069#section-2
 */
const DIGEST = {
  /**
   * The Digest auth mechanism prefix.
   * @type {String}
   */
  type: 'Digest',

  /**
   * Parse the WWW Authenticate header rest.
   * @param  {String} rest The header rest (string after the authentication mechanism prefix).
   * @return {Object}      Object representing the result of the parse operation.
   * @example
   * assert.deepEqual(
   *   DIGEST.parseWWWAuthenticateRest(
   *     'realm="testrealm@host.com", ' +
   *     'qop="auth, auth-int", ' +
   *     'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
   *     'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
   *   ), {
   *     realm: 'testrealm@host.com',
   *     qop: 'auth, auth-int',
   *     nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
   *     opaque: '5ccc069c403ebaf9f0171e9517f40e41'
   *   }
   * );
   * @api public
   */
  parseWWWAuthenticateRest: function parseWWWAuthenticateRest(
    rest: string,
  ): DigestWWWAuthenticateData {
    const data = parseHTTPHeadersQuotedKeyValueSet(
      rest,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS,
      REQUIRED_WWW_AUTHENTICATE_KEYS,
      ALLOWED_VALUES,
    );

    return data as unknown as DigestWWWAuthenticateData;
  },

  /**
   * Build the WWW Authenticate header rest.
   * @param  {Object} data The content from which to build the rest.
   * @return {String}         The built rest.
   * @example
   * assert.equal(
   *   DIGEST.buildWWWAuthenticateRest({
   *     realm: 'testrealm@host.com',
   *     qop: 'auth, auth-int',
   *     nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
   *     opaque: '5ccc069c403ebaf9f0171e9517f40e41',
   *     stale: 'false',
   *     algorithm: 'MD5'
   *   }),
   *   'realm="testrealm@host.com", ' +
   *   'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
   *   'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
   *   'stale=false, ' +
   *   'algorithm=MD5, ' +
   *   'qop="auth, auth-int"'
   * );
   * @api public
   */
  buildWWWAuthenticateRest: function buildWWWAuthenticateRest(
    data: DigestWWWAuthenticateData,
  ): string {
    return buildHTTPHeadersQuotedKeyValueSet(
      data as unknown as Record<string, string>,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS,
      REQUIRED_WWW_AUTHENTICATE_KEYS,
      UNQUOTED_WWW_AUTHENTICATE_KEYS,
      ALLOWED_VALUES,
    );
  },

  /**
   * Parse the Authorization header rest.
   * @param  {String} rest The header rest (string after the authentication mechanism prefix).)
   * @return {Object}      Object representing the result of the parse operation {hash}.
   * @example
   * assert.deepEqual(
   *   DIGEST.parseAuthorizationRest(
   *     'username="Mufasa",' +
   *     'realm="testrealm@host.com",' +
   *     'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",' +
   *     'uri="/dir/index.html",' +
   *     'algorithm=MD5,' +
   *     'qop=auth,' +
   *     'nc=00000001,' +
   *     'cnonce="0a4f113b",' +
   *     'response="6629fae49393a05397450978507c4ef1",' +
   *     'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
   *   ), {
   *     username: "Mufasa",
   *     realm: 'testrealm@host.com',
   *     nonce: "dcd98b7102dd2f0e8b11d0f600bfb0c093",
   *     uri: "/dir/index.html",
   *     algorithm: 'MD5',
   *     qop: 'auth',
   *     nc: '00000001',
   *     cnonce: "0a4f113b",
   *     response: "6629fae49393a05397450978507c4ef1",
   *     opaque: "5ccc069c403ebaf9f0171e9517f40e41"
   *   }
   * );
   * @api public
   */
  parseAuthorizationRest: function parseAuthorizationRest(
    rest: string,
  ): DigestAuthorizationData {
    const data = parseHTTPHeadersQuotedKeyValueSet(
      rest,
      AUTHORIZED_AUTHORIZATION_KEYS,
      REQUIRED_AUTHORIZATION_KEYS,
      ALLOWED_VALUES,
    );

    return data as unknown as DigestAuthorizationData;
  },

  /**
   * Build the Authorization header rest.
   * @param  {Object} data The content from which to build the rest.
   * @return {String}         The rest built.
   * @example
   * assert.equal(
   *   DIGEST.buildAuthorizationRest({
   *     username: "Mufasa",
   *     realm: 'testrealm@host.com',
   *     nonce: "dcd98b7102dd2f0e8b11d0f600bfb0c093",
   *     uri: "/dir/index.html",
   *     algorithm: 'MD5',
   *     qop: 'auth',
   *     nc: '00000001',
   *     cnonce: "0a4f113b",
   *     response: "6629fae49393a05397450978507c4ef1",
   *     opaque: "5ccc069c403ebaf9f0171e9517f40e41"
   *   }),
   *   'username="Mufasa", ' +
   *   'realm="testrealm@host.com", ' +
   *   'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
   *   'uri="/dir/index.html", ' +
   *   'response="6629fae49393a05397450978507c4ef1", ' +
   *   'algorithm=MD5, ' +
   *   'cnonce="0a4f113b", ' +
   *   'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
   *   'qop=auth, ' +
   *   'nc=00000001'
   * );
   * @api public
   */
  buildAuthorizationRest: function buildAuthorizationRest(
    data: DigestAuthorizationData,
  ): string {
    return buildHTTPHeadersQuotedKeyValueSet(
      data as unknown as Record<string, string>,
      AUTHORIZED_AUTHORIZATION_KEYS,
      REQUIRED_AUTHORIZATION_KEYS,
      UNQUOTED_AUTHORIZATION_KEYS,
      ALLOWED_VALUES,
    );
  },

  /**
   * Compute the Digest authentication hash from the given credentials.
   * @param  {Object} data The credentials to encode and other encoding details.
   * @return {String}             The hash representing the credentials.
   * @example
   * assert.equal(
   *   DIGEST.computeHash({
   *     username: 'Mufasa',
   *     realm: 'testrealm@host.com',
   *     password: 'Circle Of Life',
   *     method: 'GET',
   *     uri: '/dir/index.html',
   *     nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
   *     nc: '00000001',
   *     cnonce: '0a4f113b',
   *     qop: 'auth',
   *     algorithm: 'md5'
   *   }),
   *   '6629fae49393a05397450978507c4ef1'
   * );
   * @api public
   */
  computeHash: function computeHash(data: {
    ha1?: string;
    algorithm: string;
    method: string;
    uri: string;
    realm: string;
    username: string;
    password: string;
    nonce: string;
    nc: string;
    cnonce: string;
    qop: string;
  }): string {
    const ha1 =
      data.ha1 ||
      _computeHash(
        data.algorithm,
        [data.username, data.realm, data.password].join(':'),
      );
    const ha2 = _computeHash(data.algorithm, [data.method, data.uri].join(':'));

    return _computeHash(
      data.algorithm,
      [ha1, data.nonce, data.nc, data.cnonce, data.qop, ha2].join(':'),
    );
  },
};

function _computeHash(algorithm: string, str: string): string {
  const hashsum = crypto.createHash(algorithm);

  hashsum.update(str);
  return hashsum.digest('hex');
}

export default DIGEST;
