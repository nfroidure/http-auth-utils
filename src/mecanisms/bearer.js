/**
 * @module http-auth-utils/mecanisms/bearer
 */

import YError from 'yerror';

import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet,
} from '../utils';

const AUTHORIZED_WWW_AUTHENTICATE_KEYS = [
  'realm',
  'scope',
  'error',
  'error_description',
];

const AUTHORIZED_ERROR_CODES = [
  'invalid_request',
  'invalid_token',
  'insufficient_scope',
];

/**
 * Bearer authentication mecanism.
 * @type {Object}
 * @see https://tools.ietf.org/html/rfc6750#section-3
 */
const BEARER = {
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
    return parseHTTPHeadersQuotedKeyValueSet(
      rest,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS,
      [],
    );
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
      throw new YError('E_INVALID_ERROR', data.error, AUTHORIZED_ERROR_CODES);
    }
    return buildHTTPHeadersQuotedKeyValueSet(
      data,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS,
      [],
    );
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
      throw new YError('E_EMPTY_AUTH');
    }
    return {
      hash: rest,
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
  buildAuthorizationRest: function buildAuthorizationRest({ hash } = {}) {
    if (!hash) {
      throw new YError('E_NO_HASH');
    }
    return hash;
  },
};

export default BEARER;
