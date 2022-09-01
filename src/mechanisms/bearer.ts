/**
 * @module http-auth-utils/mechanisms/bearer
 */

import { YError } from 'yerror';

import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet,
} from '../utils.js';

const AUTHORIZED_ERROR_CODES = [
  'invalid_request',
  'invalid_token',
  'insufficient_scope',
] as const;
const REQUIRED_WWW_AUTHENTICATE_KEYS = ['realm'];
const AUTHORIZED_WWW_AUTHENTICATE_KEYS = [
  ...REQUIRED_WWW_AUTHENTICATE_KEYS,
  'scope',
  'error',
  'error_description',
];
type BearerWWWAuthenticateData = {
  realm: string;
  scope?: string;
  error?: typeof AUTHORIZED_ERROR_CODES[number];
  error_description?: string;
};
type BearerAuthorizationData = {
  hash: string;
};

type BearerAuthorizedErrorCodes = typeof AUTHORIZED_ERROR_CODES[number];

/* Architecture Note #1.1: Bearer mechanism

See the following [RFC](https://tools.ietf.org/html/rfc6750).

*/

/**
 * Bearer authentication mechanism.
 * @type {Object}
 * @see https://tools.ietf.org/html/rfc6750#section-3
 */
const BEARER = {
  /**
   * The Bearer auth mechanism prefix.
   * @type {String}
   */
  type: 'Bearer',

  /**
   * Parse the WWW Authenticate header rest.
   * @param  {String} rest The header rest (string after the authentication mechanism prefix).
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
  parseWWWAuthenticateRest: function parseWWWAuthenticateRest(
    rest: string,
  ): BearerWWWAuthenticateData {
    return parseHTTPHeadersQuotedKeyValueSet(
      rest,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS as unknown as string[],
      [],
    ) as BearerWWWAuthenticateData;
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
  buildWWWAuthenticateRest: function buildWWWAuthenticateRest(
    data: BearerWWWAuthenticateData,
  ): string {
    if (
      data.error &&
      -1 ===
        AUTHORIZED_ERROR_CODES.indexOf(
          data.error as unknown as BearerAuthorizedErrorCodes,
        )
    ) {
      throw new YError('E_INVALID_ERROR', data.error, AUTHORIZED_ERROR_CODES);
    }
    return buildHTTPHeadersQuotedKeyValueSet(
      data,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS as unknown as string[],
      [],
    );
  },

  /**
   * Parse the Authorization header rest.
   * @param  {String} rest The header rest (string after the authentication mechanism prefix).)
   * @return {Object}      Object representing the result of the parse operation {hash}.
   * @example
   * assert.deepEqual(
   *   BEARER.parseAuthorizationRest('mF_9.B5f-4.1JqM'), {
   *     hash: 'mF_9.B5f-4.1JqM',
   *   }
   * );
   * @api public
   */
  parseAuthorizationRest: function parseAuthorizationRest(
    rest: string,
  ): BearerAuthorizationData {
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
  buildAuthorizationRest: function buildAuthorizationRest({
    hash,
  }: BearerAuthorizationData): string {
    if (!hash) {
      throw new YError('E_NO_HASH');
    }
    return hash;
  },
};

export default BEARER;
