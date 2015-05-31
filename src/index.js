import YError from 'yerror';

import BASIC from './mecanisms/basic';
/**
 * @module http-auth-utils
 */

import DIGEST from './mecanisms/digest';

/**
 * Natively supported authentication mecanisms.
 * @type {Array}
 * @see  The Basic {@link module:http-auth-utils/mecanisms/basic} and Digest {@link module:http-auth-utils/mecanisms/digest}
 */
export const mecanisms = [BASIC, DIGEST];

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
export const parseWWWAuthenticateHeader =
  function parseWWWAuthenticateHeader(header, authMecanisms = mecanisms) {
    let result = null;
    authMecanisms.some(function(authMecanism) {
      if(0 === header.indexOf(authMecanism.type + ' ')) {
        result = {
          type: authMecanism.type,
          data: authMecanism.parseWWWAuthenticateRest(
            header.substr(authMecanism.type.length + 1)
          )
        };
      }
    });
    if(result) {
      return result;
    }
    throw new YError('E_UNKNOWN_AUTH_MECANISM', header);
  };

/**
 * Parse HTTP Authorization header contents.
 * @type {Function}
 * @param {string} header The Authorization header contents
 * @param {Array} [authMecanisms=[BASIC, DIGEST]] Allow providing custom authentication mecanisms.
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
export const parseAuthorizationHeader =
  function parseAuthorizationHeader(header, authMecanisms = mecanisms) {
    let result = null;
    authMecanisms.some(function(authMecanism) {
      if(0 === header.indexOf(authMecanism.type + ' ')) {
        result = {
          type: authMecanism.type,
          data: authMecanism.parseAuthorizationRest(
            header.substr(authMecanism.type.length + 1)
          )
        };
      }
    });
    if(result) {
      return result;
    }
    throw new YError('E_UNKNOWN_AUTH_MECANISM', header);
  };
