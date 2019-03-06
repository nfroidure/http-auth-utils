import YError from 'yerror';

import BASIC from './mechanisms/basic';
import DIGEST from './mechanisms/digest';
import BEARER from './mechanisms/bearer';

/**
 * @module http-auth-utils
 */

/**
 * Natively supported authentication mechanisms.
 * @type {Array}
 */
const mechanisms = [BASIC, DIGEST, BEARER];

/**
 * Basic authentication mechanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mechanisms/basic}
 */
BASIC;

/**
 * Digest authentication mechanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mechanisms/digest}
 */
DIGEST;

/**
 * Bearer authentication mechanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mechanisms/digest}
 */
BEARER;

export { BASIC, DIGEST, BEARER, mechanisms };

/**
 * Parse HTTP WWW-Authenticate header contents.
 * @type {Function}
 * @param {string} header The WWW-Authenticate header contents
 * @param {Array} [authMechanisms=[BASIC, DIGEST, BEARER]]
 * Allow providing custom authentication mechanisms.
 * @return {Object} Result of the contents parse.
 * @api public
 * @example
 * assert.deepEqual(
 *   parseWWWAuthenticateHeader('Basic realm="test"'), {
 *     type: 'Basic',
 *     data: {
 *       realm: 'test'
 *     }
 *   }
 * );
 */
export function parseWWWAuthenticateHeader(
  header,
  authMechanisms = mechanisms,
) {
  let result = null;

  authMechanisms.some(authMechanism => {
    if (0 === header.indexOf(authMechanism.type + ' ')) {
      result = {
        type: authMechanism.type,
        data: authMechanism.parseWWWAuthenticateRest(
          header.substr(authMechanism.type.length + 1),
        ),
      };
      return true;
    }
    return false;
  });
  if (!result) {
    throw new YError('E_UNKNOWN_AUTH_MECHANISM', header);
  }
  return result;
}

/**
 * Parse HTTP Authorization header contents.
 * @type {Function}
 * @param {string} header The Authorization header contents
 * @param {Array} [authMechanisms=[BASIC, DIGEST, BEARER]]
 * Allow custom authentication mechanisms.
 * @return {Object} Result of the contents parse.
 * @api public
 * @example
 * assert.deepEqual(
 *   parseAuthorizationHeader('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
 *     type: 'Basic',
 *     data: {
 *       hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
 *     }
 *   }
 * );
 */
export function parseAuthorizationHeader(header, authMechanisms = mechanisms) {
  let result = null;

  authMechanisms.some(function(authMechanism) {
    if (0 === header.indexOf(authMechanism.type + ' ')) {
      result = {
        type: authMechanism.type,
        data: authMechanism.parseAuthorizationRest(
          header.substr(authMechanism.type.length + 1),
        ),
      };
      return true;
    }
    return false;
  });
  if (result) {
    return result;
  }
  throw new YError('E_UNKNOWN_AUTH_MECHANISM', header);
}

/**
 * Build HTTP WWW-Authenticate header value.
 * @type {Function}
 * @param {Object} authMechanism The mechanism to use
 * @param {Object}
 * The WWW-Authenticate header contents to base the value on.
 * @return {string} The header value.
 * @api public
 * @example
 * assert.deepEqual(
 *   buildWWWAuthenticateHeader(BASIC, {
 *     realm: 'test'
 *   }),
 *   'Basic realm="test"'
 * );
 */
export function buildWWWAuthenticateHeader(authMechanism, data) {
  return `${authMechanism.type} ${authMechanism.buildWWWAuthenticateRest(
    data,
  )}`;
}
