'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yerror = require('yerror');

var _yerror2 = _interopRequireDefault(_yerror);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module http-auth-utils/mecanisms/bearer
 */

var AUTHORIZED_WWW_AUTHENTICATE_KEYS = ['realm', 'scope', 'error', 'error_description'];

var AUTHORIZED_ERROR_CODES = ['invalid_request', 'invalid_token', 'insufficient_scope'];

/**
 * Bearer authentication mecanism.
 * @type {Object}
 * @see https://tools.ietf.org/html/rfc6750#section-3
 */
var BEARER = {

  /**
   * The Digest auth mecanism prefix.
   * @type {String}
   */
  type: 'Bearer',

  /**
   * Parse the WWW Authenticate header rest.
   * @param  {String} rest The header rest (string after the authentication mecanism prefix).
   * @return {Object}      Object representing the result of the parse operation.
   * @example
   * assert.deepEqual(
   *   BEARER.parseWWWAuthenticateRest(
   *     'realm="testrealm@host.com", ' +
   *     'scope="openid profile email"'
   *   ), {
   *     realm: 'testrealm@host.com',
   *     scope: 'openid profile email',
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
   *   BEARER.buildWWWAuthenticateRest({
   *     realm: 'testrealm@host.com',
   *     error: 'invalid_request',
   *     error_description: 'The access token expired',
   *   }),
   *   'realm="testrealm@host.com", ' +
   *   'error="invalid_request", ' +
   *   'error_description="The access token expired"'
   * );
   * @api public
   */
  buildWWWAuthenticateRest: function buildWWWAuthenticateRest(data) {
    if (data.error && -1 === AUTHORIZED_ERROR_CODES.indeOf(data.error)) {
      throw new _yerror2.default('E_INVALID_ERROR', data.error, AUTHORIZED_ERROR_CODES);
    }
    return (0, _utils.buildHTTPHeadersQuotedKeyValueSet)(data, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },

  /**
   * Parse the Authorization header rest.
   * @param  {String} rest The header rest (string after the authentication mecanism prefix).)
   * @return {Object}      Object representing the result of the parse operation {hash}.
   * @example
   * assert.deepEqual(
   *   BEARER.parseAuthorizationRest('mF_9.B5f-4.1JqM'), {
   *     hash: 'mF_9.B5f-4.1JqM',
   *   }
   * );
   * @api public
   */
  parseAuthorizationRest: function parseAuthorizationRest(rest) {
    if (!rest) {
      throw new _yerror2.default('E_EMPTY_AUTH');
    }
    return {
      hash: rest
    };
  },

  /**
   * Build the Authorization header rest.
   * @param  {Object} content The content from wich to build the rest.
   * @return {String}         The rest built.
   * @example
   * assert.equal(
   *   BEARER.buildAuthorizationRest({
   *     hash: 'mF_9.B5f-4.1JqM'
   *   }),
   *   'mF_9.B5f-4.1JqM=='
   * );
   * @api public
   */
  buildAuthorizationRest: function buildAuthorizationRest() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var hash = _ref.hash;

    if (!hash) {
      throw new _yerror2.default('E_NO_HASH');
    }
    return hash;
  }
};

exports.default = BEARER;