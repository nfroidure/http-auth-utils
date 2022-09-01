import { YError } from 'yerror';

import BASIC from './mechanisms/basic.js';
import DIGEST from './mechanisms/digest.js';
import BEARER from './mechanisms/bearer.js';

/* Architecture Note #1: Module structure

Since the `WWW-Authenticate` and the `Authorization` headers parsing
 is very similar whatever authentication mechanism is used, we export
 a generic set of function that parse/build those headers given a
 list of authorized mechanisms.

See the following [RFC](https://tools.ietf.org/html/rfc7235).

*/

export type Mechanism = {
  type: string;
  parseWWWAuthenticateRest(rest: string): Record<string, string>;
  buildWWWAuthenticateRest(data: Record<string, string>): string;
  parseAuthorizationRest(rest: string): Record<string, string>;
  buildAuthorizationRest(data: Record<string, string>): string;
};

/**
 * @module http-auth-utils
 */

/**
 * Natively supported authentication mechanisms.
 * @type {Array}
 */
const mechanisms: Mechanism[] = [BASIC, DIGEST, BEARER];

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
 * @param {string} header
 * The WWW-Authenticate header contents
 * @param {Array} [authMechanisms=[BASIC, DIGEST, BEARER]]
 * Allow providing custom authentication mechanisms.
 * @param {Object} [options]
 * Parsing options
 * @param {boolean} [options.strict=true]
 * Strictly detect the mechanism type (case sensitive)
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
export function parseWWWAuthenticateHeader<
  T extends Mechanism = typeof BASIC | typeof BEARER | typeof DIGEST,
>(
  header: string,
  authMechanisms: T[] = mechanisms as T[],
  { strict = true }: { strict: boolean } = { strict: true },
): {
  type: T['type'];
  data: ReturnType<T['parseWWWAuthenticateRest']>;
} {
  let result: {
    type: T['type'];
    data: ReturnType<T['parseWWWAuthenticateRest']>;
  } | null = null;

  authMechanisms.some((authMechanism) => {
    if (
      0 === header.indexOf(authMechanism.type + ' ') ||
      (!strict && 0 === header.indexOf(authMechanism.type.toLowerCase() + ' '))
    ) {
      result = {
        type: authMechanism.type,
        data: authMechanism.parseWWWAuthenticateRest(
          header.substr(authMechanism.type.length + 1),
        ) as ReturnType<T['parseWWWAuthenticateRest']>,
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
 * @param {Object} [options]
 * Parsing options
 * @param {boolean} [options.strict=true]
 * Strictly detect the mechanism type (case sensitive)
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
export function parseAuthorizationHeader<
  T extends Mechanism = typeof BASIC | typeof BEARER | typeof DIGEST,
>(
  header: string,
  authMechanisms: T[] = mechanisms as T[],
  { strict = true }: { strict: boolean } = { strict: true },
): {
  type: T['type'];
  data: ReturnType<T['parseAuthorizationRest']>;
} {
  let result: {
    type: T['type'];
    data: ReturnType<T['parseAuthorizationRest']>;
  } | null = null;

  authMechanisms.some(function (authMechanism) {
    if (
      0 === header.indexOf(authMechanism.type + ' ') ||
      (!strict && 0 === header.indexOf(authMechanism.type.toLowerCase() + ' '))
    ) {
      result = {
        type: authMechanism.type,
        data: authMechanism.parseAuthorizationRest(
          header.substr(authMechanism.type.length + 1),
        ) as ReturnType<T['parseAuthorizationRest']>,
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
export function buildWWWAuthenticateHeader<T extends Mechanism>(
  authMechanism: T,
  data: Parameters<T['buildWWWAuthenticateRest']>[0],
): string {
  return `${authMechanism.type} ${authMechanism.buildWWWAuthenticateRest(
    data,
  )}`;
}

/**
 * Build HTTP Authorization header value.
 * @type {Function}
 * @param {Object} authMechanism The mechanism to use
 * @param {Object}
 * The Authorization header contents to base the value on.
 * @return {string} The header value.
 * @api public
 * @example
 * assert.deepEqual(
 *   buildAuthorizationHeader(BASIC, {
 *     realm: 'test'
 *   }),
 *   'Basic realm="test"'
 * );
 */
export function buildAuthorizationHeader<T extends Mechanism>(
  authMechanism: T,
  data: Parameters<T['buildAuthorizationRest']>[0],
): string {
  return `${authMechanism.type} ${authMechanism.buildAuthorizationRest(data)}`;
}
