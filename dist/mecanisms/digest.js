'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module http-auth-utils/mecanisms/digest
 */

var AUTHORIZED_WWW_AUTHENTICATE_KEYS = ['realm', 'domain', 'qop', 'nonce', 'opaque', 'stale', 'algorithm'];
var AUTHORIZED_AUTHORIZATION_KEYS = ['username', 'realm', 'nonce', 'uri', 'response', 'algorithm', 'cnonce', 'opaque', 'qop', 'nc'];

/**
 * Digest authentication mecanism.
 * @type {Object}
 * @see http://tools.ietf.org/html/rfc2617#section-3
 * @see http://tools.ietf.org/html/rfc2069#section-2
 */
var DIGEST = {
  /**
   * The Digest auth mecanism prefix.
   * @type {String}
   */
  type: 'Digest',

  /**
   * Parse the WWW Authenticate header rest.
   * @param  {String} rest The header rest (string after the authentication mecanism prefix).
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
  parseWWWAuthenticateRest: function parseWWWAuthenticateRest(rest) {
    return (0, _utils.parseHTTPHeadersQuotedKeyValueSet)(rest, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },

  /**
   * Build the WWW Authenticate header rest.
   * @param  {Object} data The content from wich to build the rest.
   * @return {String}         The built rest.
   * @example
   * assert.equal(
   *   DIGEST.buildWWWAuthenticateRest({
   *     realm: 'testrealm@host.com',
   *     qop: 'auth, auth-int',
   *     nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
   *     opaque: '5ccc069c403ebaf9f0171e9517f40e41'
   *   }),
   *   'realm="testrealm@host.com", ' +
   *   'qop="auth, auth-int", ' +
   *   'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
   *   'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
   * );
   * @api public
   */
  buildWWWAuthenticateRest: function buildWWWAuthenticateRest(data) {
    return (0, _utils.buildHTTPHeadersQuotedKeyValueSet)(data, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },

  /**
   * Parse the Authorization header rest.
   * @param  {String} rest The header rest (string after the authentication mecanism prefix).)
   * @return {Object}      Object representing the result of the parse operation {hash}.
   * @example
   * assert.deepEqual(
   *   DIGEST.parseAuthorizationRest(
   *     'username="Mufasa",' +
   *     'realm="testrealm@host.com",' +
   *     'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",' +
   *     'uri="/dir/index.html",' +
   *     'qop="auth",' +
   *     'nc="00000001",' +
   *     'cnonce="0a4f113b",' +
   *     'response="6629fae49393a05397450978507c4ef1",' +
   *     'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
   *   ), {
   *     username: "Mufasa",
   *     realm: 'testrealm@host.com',
   *     nonce: "dcd98b7102dd2f0e8b11d0f600bfb0c093",
   *     uri: "/dir/index.html",
   *     qop: 'auth',
   *     nc: '00000001',
   *     cnonce: "0a4f113b",
   *     response: "6629fae49393a05397450978507c4ef1",
   *     opaque: "5ccc069c403ebaf9f0171e9517f40e41"
   *   }
   * );
   * @api public
   */
  parseAuthorizationRest: function parseAuthorizationRest(rest) {
    return (0, _utils.parseHTTPHeadersQuotedKeyValueSet)(rest, AUTHORIZED_AUTHORIZATION_KEYS, []);
  },

  /**
   * Build the Authorization header rest.
   * @param  {Object} data The content from wich to build the rest.
   * @return {String}         The rest built.
   * @example
   * assert.equal(
   *   DIGEST.buildAuthorizationRest({
   *     username: "Mufasa",
   *     realm: 'testrealm@host.com',
   *     nonce: "dcd98b7102dd2f0e8b11d0f600bfb0c093",
   *     uri: "/dir/index.html",
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
   *   'cnonce="0a4f113b", ' +
   *   'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
   *   'qop="auth", ' +
   *   'nc="00000001"'
   * );
   * @api public
   */
  buildAuthorizationRest: function buildAuthorizationRest(data) {
    return (0, _utils.buildHTTPHeadersQuotedKeyValueSet)(data, AUTHORIZED_AUTHORIZATION_KEYS, []);
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
  computeHash: function computeHash(data) {
    var ha1 = data.ha1 || _computeHash(data.algorithm, [data.username, data.realm, data.password].join(':'));
    var ha2 = _computeHash(data.algorithm, [data.method, data.uri].join(':'));

    return _computeHash(data.algorithm, [ha1, data.nonce, data.nc, data.cnonce, data.qop, ha2].join(':'));
  }
};

function _computeHash(algorithm, str) {
  var hashsum = _crypto2.default.createHash(algorithm);

  hashsum.update(str);
  return hashsum.digest('hex');
}

exports.default = DIGEST;