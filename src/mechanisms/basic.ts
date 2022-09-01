/**
 * @module http-auth-utils/mechanisms/basic
 */

import { YError } from 'yerror';

import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet,
} from '../utils.js';

const REQUIRED_WWW_AUTHENTICATE_KEYS = ['realm'];
const AUTHORIZED_WWW_AUTHENTICATE_KEYS = REQUIRED_WWW_AUTHENTICATE_KEYS;
type BasicWWWAuthenticateData = {
  realm: string;
};
type BasicAuthorizationData = {
  username: string;
  password: string;
};

/* Architecture Note #1.2: Basic mechanism

See the following [RFC](https://tools.ietf.org/html/rfc7617).

*/

/**
 * Basic authentication mechanism.
 * @type {Object}
 * @see http://tools.ietf.org/html/rfc2617#section-2
 */
const BASIC = {
  /**
   * The Basic auth mechanism prefix.
   * @type {String}
   */
  type: 'Basic',

  /**
   * Parse the WWW Authenticate header rest.
   * @param  {String} rest The header rest (string after the authentication mechanism prefix).
   * @return {Object}      Object representing the result of the parse operation.
   * @example
   * assert.deepEqual(
   *   BASIC.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
   *     realm: 'perlinpinpin'
   *   }
   * );
   * @api public
   */
  parseWWWAuthenticateRest: function parseWWWAuthenticateRest(
    rest: string,
  ): BasicWWWAuthenticateData {
    return parseHTTPHeadersQuotedKeyValueSet(
      rest,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS,
      REQUIRED_WWW_AUTHENTICATE_KEYS,
    ) as BasicWWWAuthenticateData;
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
  buildWWWAuthenticateRest: function buildWWWAuthenticateRest(
    data: BasicWWWAuthenticateData,
  ): string {
    return buildHTTPHeadersQuotedKeyValueSet(
      data,
      AUTHORIZED_WWW_AUTHENTICATE_KEYS,
      REQUIRED_WWW_AUTHENTICATE_KEYS,
    );
  },

  /**
   * Parse the Authorization header rest.
   * @param  {String} rest The header rest (string after the authentication mechanism prefix).)
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
  parseAuthorizationRest: function parseAuthorizationRest(
    rest: string,
  ): BasicAuthorizationData & { hash: string } {
    if (!rest) {
      throw new YError('E_EMPTY_AUTH');
    }
    const { username, password } = BASIC.decodeHash(rest);

    return {
      hash: rest,
      username,
      password,
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
  buildAuthorizationRest: function buildAuthorizationRest({
    hash,
    username,
    password,
  }:
    | ({
        hash: string;
      } & Partial<BasicAuthorizationData>)
    | (BasicAuthorizationData & {
        hash?: string;
      })): string {
    if (username && password) {
      return BASIC.computeHash({
        username,
        password,
      });
    }
    if (!hash) {
      throw new YError('E_NO_HASH');
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
  computeHash: function computeHash({
    username,
    password,
  }: BasicAuthorizationData): string {
    return Buffer.from(username + ':' + password).toString('base64');
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
  decodeHash: function decodeHash(hash: string): BasicAuthorizationData {
    const [username, ...passwordParts] = Buffer.from(hash, 'base64')
      .toString()
      .split(':');

    return {
      username,
      password: passwordParts.join(':'),
    };
  },
};

export default BASIC;
