'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yerror = require('yerror');

var _yerror2 = _interopRequireDefault(_yerror);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /**
                                                                               * @module http-auth-utils/mecanisms/basic
                                                                               */

var AUTHORIZED_WWW_AUTHENTICATE_KEYS = ['realm'];

/**
 * Basic authentication mecanism.
 * @type {Object}
 * @see http://tools.ietf.org/html/rfc2617#section-2
 */
var BASIC = {
  /**
   * The Basic auth mecanism prefix.
   * @type {String}
   */
  type: 'Basic',

  /**
   * Parse the WWW Authenticate header rest.
   * @param  {String} rest The header rest (string after the authentication mecanism prefix).
   * @return {Object}      Object representing the result of the parse operation.
   * @example
   * assert.deepEqual(
   *   BASIC.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
   *     realm: 'perlinpinpin'
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
   *   BASIC.buildWWWAuthenticateRest({
   *     realm: 'perlinpinpin'
   *   }),
   *   'realm="perlinpinpin"'
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
   *   BASIC.parseAuthorizationRest('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
   *     hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
   *     username: 'Ali Baba',
   *     password: 'open sesame'
   *   }
   * );
   * @api public
   */
  parseAuthorizationRest: function parseAuthorizationRest(rest) {
    if (!rest) {
      throw new _yerror2.default('E_EMPTY_AUTH');
    }

    var _BASIC$decodeHash = BASIC.decodeHash(rest),
        username = _BASIC$decodeHash.username,
        password = _BASIC$decodeHash.password;

    return {
      hash: rest,
      username: username,
      password: password
    };
  },

  /**
   * Build the Authorization header rest.
   * @param  {Object} content The content from wich to build the rest.
   * @return {String}         The rest built.
   * @example
   * assert.equal(
   *   BASIC.buildAuthorizationRest({
   *     hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
   *   }),
   *   'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
   * );
   * @api public
   */
  buildAuthorizationRest: function buildAuthorizationRest() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        hash = _ref.hash,
        username = _ref.username,
        password = _ref.password;

    if (username && password) {
      return BASIC.computeHash({
        username: username,
        password: password
      });
    }
    if (!hash) {
      throw new _yerror2.default('E_NO_HASH');
    }
    return hash;
  },

  /**
   * Compute the Basic authentication hash from the given credentials.
   * @param  {Object} credentials The credentials to encode {username, password}.
   * @return {String}             The hash representing the credentials.
   * @example
   * assert.equal(
   *   BASIC.computeHash({
   *     username: 'Ali Baba',
   *     password: 'open sesame'
   *   }),
   *   'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
   * );
   * @api public
   */
  computeHash: function computeHash(_ref2) {
    var username = _ref2.username,
        password = _ref2.password;

    return new Buffer(username + ':' + password).toString('base64');
  },

  /**
   * Decode the Basic hash and return the corresponding credentials.
   * @param  {String} hash The hash.
   * @return {Object}      Object representing the credentials {username, password}.
   * @example
   * assert.deepEqual(
   *   BASIC.decodeHash('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
   *     username: 'Ali Baba',
   *     password: 'open sesame'
   *   }
   * );
   * @api public
   */
  decodeHash: function decodeHash(hash) {
    var _toString$split = new Buffer(hash, 'base64').toString().split(':'),
        _toString$split2 = _toArray(_toString$split),
        username = _toString$split2[0],
        passwordParts = _toString$split2.slice(1);

    return {
      username: username,
      password: passwordParts.join(':')
    };
  }
};

exports.default = BASIC;