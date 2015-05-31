/**
 * @module http-auth-utils/mecanisms/basic
 */
import YError from 'yerror';

import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet
} from '../utils';

const AUTHORIZED_WWW_AUTHENTICATE_KEYS = ['realm'];

/**
 * Basic authentication mecanism.
 * @type {Object}
 * @see http://tools.ietf.org/html/rfc2617#section-2
 */
const BASIC = {

  /**
   * The Basic auth mecanism prefix.
   * @type {String}
   */
  type: 'Basic',

  /**
   * Parse the WWW Authenticate header rest.
   * @param  {String} rest The header rest (string got after removing the authentication mecanism prefix).
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
    return parseHTTPHeadersQuotedKeyValueSet(rest, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },

  /**
   * Build the WWW Authenticate header rest.
   * @param  {Object} content The content from wich to build the rest.
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
    return buildHTTPHeadersQuotedKeyValueSet(data, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },

  /**
   * Parse the Authorization header rest.
   * @param  {String} rest The header rest (string got after removing the authentication mecanism prefix).)
   * @return {Object}      Object representing the result of the parse operation {hash}.
   * @example
   * assert.deepEqual(
   *   BASIC.parseAuthorizationRest('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
   *     hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
   *   }
   * );
   * @api public
   */
  parseAuthorizationRest: function parseAuthorizationRest(rest) {
    if(!rest) {
      throw new YError('E_EMPTY_AUTH');
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
   *   BASIC.buildAuthorizationRest({
   *     hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
   *   }),
   *   'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
   * );
   * @api public
   */
  buildAuthorizationRest: function buildAuthorizationRest({hash}) {
    return hash;
  },

  /**
   * Compute the Basic authentication hash from the given credentials.
   * @param  {Object} credentials The credentials to encode {username, password}.
   * @return {String}             The hash representing the credentials.
   * @example
   * assert.equal(
   *   BASIC.computeHash({
   *     username: 'Aladdin',
   *     password: 'open sesame'
   *   }),
   *   'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
   * );
   * @api public
   */
  computeHash: function computeHash({username, password}) {
    return (new Buffer(username + ':' + password)).toString('base64');
  },

  /**
   * Decode the Basic hash and return the corresponding credentials.
   * @param  {String} hash The hash.
   * @return {Object}      Object representing the credentials {username, password}.
   * @example
   * assert.deepEqual(
   *   BASIC.decodeHash('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
   *     username: 'Aladdin',
   *     password: 'open sesame'
   *   }
   * );
   * @api public
   */
  decodeHash: function decodeHash(hash) {
    let [username, password] = ((new Buffer(hash, 'base64')).toString()).split(':');
    return {
      username,
      password
    };
  }
};

export default BASIC;
