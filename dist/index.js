'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mecanisms = exports.BEARER = exports.DIGEST = exports.BASIC = undefined;
exports.parseWWWAuthenticateHeader = parseWWWAuthenticateHeader;
exports.parseAuthorizationHeader = parseAuthorizationHeader;

var _yerror = require('yerror');

var _yerror2 = _interopRequireDefault(_yerror);

var _basic = require('./mecanisms/basic');

var _basic2 = _interopRequireDefault(_basic);

var _digest = require('./mecanisms/digest');

var _digest2 = _interopRequireDefault(_digest);

var _bearer = require('./mecanisms/bearer');

var _bearer2 = _interopRequireDefault(_bearer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module http-auth-utils
 */

/**
 * Basic authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/basic}
 */
exports.BASIC = _basic2.default;

/**
 * Digest authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/digest}
 */

exports.DIGEST = _digest2.default;

/**
 * Bearer authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/digest}
 */

exports.BEARER = _bearer2.default;

/**
 * Natively supported authentication mecanisms.
 * @type {Array}
 */

var mecanisms = exports.mecanisms = [_basic2.default, _digest2.default, _bearer2.default];

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
function parseWWWAuthenticateHeader(header) {
  var authMecanisms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mecanisms;

  var result = null;

  authMecanisms.some(function (authMecanism) {
    if (0 === header.indexOf(authMecanism.type + ' ')) {
      result = {
        type: authMecanism.type,
        data: authMecanism.parseWWWAuthenticateRest(header.substr(authMecanism.type.length + 1))
      };
      return true;
    }
    return false;
  });
  if (!result) {
    throw new _yerror2.default('E_UNKNOWN_AUTH_MECANISM', header);
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
function parseAuthorizationHeader(header) {
  var authMecanisms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mecanisms;

  var result = null;

  authMecanisms.some(function (authMecanism) {
    if (0 === header.indexOf(authMecanism.type + ' ')) {
      result = {
        type: authMecanism.type,
        data: authMecanism.parseAuthorizationRest(header.substr(authMecanism.type.length + 1))
      };
      return true;
    }
    return false;
  });
  if (result) {
    return result;
  }
  throw new _yerror2.default('E_UNKNOWN_AUTH_MECANISM', header);
}