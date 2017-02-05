import YError from 'yerror';

import BASIC from './mecanisms/basic';
import DIGEST from './mecanisms/digest';
import BEARER from './mecanisms/bearer';

/**
 * @module http-auth-utils
 */

/**
 * Basic authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/basic}
 */
export { BASIC as BASIC };

/**
 * Digest authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/digest}
 */
export { DIGEST as DIGEST };

/**
 * Bearer authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/digest}
 */
export { BEARER as BEARER };

/**
 * Natively supported authentication mecanisms.
 * @type {Array}
 */
export const mecanisms = [BASIC, DIGEST, BEARER];

/**
 * Parse HTTP WWW-Authenticate header contents.
 * @type {Function}
 * @param {string} header The WWW-Authenticate header contents
 * @param {Array} [authMecanisms=[BASIC, DIGEST]] Allow providing custom authentication mecanisms.
 * @return {Object} Result of the contents parse.
 * @api public
 * @example
 * assert.equal(
 *   parseWWWAuthenticateHeader('Basic realm="test"'), {
 *     type: 'Basic',
 *     data: {
 *       realm: 'test'
 *     }
 *   }
 * );
 */
export function parseWWWAuthenticateHeader(header, authMecanisms = mecanisms) {
  let result = null;

  authMecanisms.some((authMecanism) => {
    if(0 === header.indexOf(authMecanism.type + ' ')) {
      result = {
        type: authMecanism.type,
        data: authMecanism.parseWWWAuthenticateRest(
          header.substr(authMecanism.type.length + 1)
        ),
      };
      return true;
    }
    return false;
  });
  if(!result) {
    throw new YError('E_UNKNOWN_AUTH_MECANISM', header);
  }
  return result;
}

/**
 * Parse HTTP Authorization header contents.
 * @type {Function}
 * @param {string} header The Authorization header contents
 * @param {Array} [authMecanisms=[BASIC, DIGEST, BEARER]] Allow custom authentication mecanisms.
 * @return {Object} Result of the contents parse.
 * @api public
 * @example
 * assert.equal(
 *   parseAuthorizationHeader('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
 *     type: 'Basic',
 *     data: {
 *       hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
 *     }
 *   }
 * );
 */
export function parseAuthorizationHeader(header, authMecanisms = mecanisms) {
  let result = null;

  authMecanisms.some(function(authMecanism) {
    if(0 === header.indexOf(authMecanism.type + ' ')) {
      result = {
        type: authMecanism.type,
        data: authMecanism.parseAuthorizationRest(
          header.substr(authMecanism.type.length + 1)
        ),
      };
      return true;
    }
    return false;
  });
  if(result) {
    return result;
  }
  throw new YError('E_UNKNOWN_AUTH_MECANISM', header);
}
