'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mechanisms = exports.BEARER = exports.DIGEST = exports.BASIC = undefined;
exports.parseWWWAuthenticateHeader = parseWWWAuthenticateHeader;
exports.parseAuthorizationHeader = parseAuthorizationHeader;

var _yerror = require('yerror');

var _yerror2 = _interopRequireDefault(_yerror);

var _basic = require('./mechanisms/basic');

var _basic2 = _interopRequireDefault(_basic);

var _digest = require('./mechanisms/digest');

var _digest2 = _interopRequireDefault(_digest);

var _bearer = require('./mechanisms/bearer');

var _bearer2 = _interopRequireDefault(_bearer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module http-auth-utils
 */

/**
 * Natively supported authentication mechanisms.
 * @type {Array}
 */
var mechanisms = [_basic2.default, _digest2.default, _bearer2.default];

/**
 * Basic authentication mechanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mechanisms/basic}
 */
_basic2.default;

/**
 * Digest authentication mechanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mechanisms/digest}
 */
_digest2.default;

/**
 * Bearer authentication mechanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mechanisms/digest}
 */
_bearer2.default;

exports.BASIC = _basic2.default;
exports.DIGEST = _digest2.default;
exports.BEARER = _bearer2.default;
exports.mechanisms = mechanisms;

/**
 * Parse HTTP WWW-Authenticate header contents.
 * @type {Function}
 * @param {string} header The WWW-Authenticate header contents
 * @param {Array} [authMechanisms=[BASIC, DIGEST]] Allow providing custom authentication mechanisms.
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
  var authMechanisms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mechanisms;

  var result = null;

  authMechanisms.some(function (authMechanism) {
    if (0 === header.indexOf(authMechanism.type + ' ')) {
      result = {
        type: authMechanism.type,
        data: authMechanism.parseWWWAuthenticateRest(header.substr(authMechanism.type.length + 1))
      };
      return true;
    }
    return false;
  });
  if (!result) {
    throw new _yerror2.default('E_UNKNOWN_AUTH_MEChANISM', header);
  }
  return result;
}

/**
 * Parse HTTP Authorization header contents.
 * @type {Function}
 * @param {string} header The Authorization header contents
 * @param {Array} [authMechanisms=[BASIC, DIGEST, BEARER]] Allow custom authentication mechanisms.
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
  var authMechanisms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mechanisms;

  var result = null;

  authMechanisms.some(function (authMechanism) {
    if (0 === header.indexOf(authMechanism.type + ' ')) {
      result = {
        type: authMechanism.type,
        data: authMechanism.parseAuthorizationRest(header.substr(authMechanism.type.length + 1))
      };
      return true;
    }
    return false;
  });
  if (result) {
    return result;
  }
  throw new _yerror2.default('E_UNKNOWN_AUTH_MEChANISM', header);
}