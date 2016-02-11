'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _yerror = require('yerror');

var _yerror2 = _interopRequireDefault(_yerror);

var _mecanismsBasic = require('./mecanisms/basic');

var _mecanismsBasic2 = _interopRequireDefault(_mecanismsBasic);

/**
 * @module http-auth-utils
 */

var _mecanismsDigest = require('./mecanisms/digest');

var _mecanismsDigest2 = _interopRequireDefault(_mecanismsDigest);

/**
 * Basic authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/basic}
 */
exports.BASIC = _mecanismsBasic2['default'];

/**
 * Digest authentication mecanism.
 * @type {Object}
 * @see  {@link module:http-auth-utils/mecanisms/digest}
 */
exports.DIGEST = _mecanismsDigest2['default'];

/**
 * Natively supported authentication mecanisms.
 * @type {Array}
 */
var mecanisms = [_mecanismsBasic2['default'], _mecanismsDigest2['default']];

exports.mecanisms = mecanisms;
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
var parseWWWAuthenticateHeader = function parseWWWAuthenticateHeader(header) {
  var authMecanisms = arguments.length <= 1 || arguments[1] === undefined ? mecanisms : arguments[1];

  var result = null;
  authMecanisms.some(function (authMecanism) {
    if (0 === header.indexOf(authMecanism.type + ' ')) {
      result = {
        type: authMecanism.type,
        data: authMecanism.parseWWWAuthenticateRest(header.substr(authMecanism.type.length + 1))
      };
    }
  });
  if (result) {
    return result;
  }
  throw new _yerror2['default']('E_UNKNOWN_AUTH_MECANISM', header);
};

exports.parseWWWAuthenticateHeader = parseWWWAuthenticateHeader;
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
var parseAuthorizationHeader = function parseAuthorizationHeader(header) {
  var authMecanisms = arguments.length <= 1 || arguments[1] === undefined ? mecanisms : arguments[1];

  var result = null;
  authMecanisms.some(function (authMecanism) {
    if (0 === header.indexOf(authMecanism.type + ' ')) {
      result = {
        type: authMecanism.type,
        data: authMecanism.parseAuthorizationRest(header.substr(authMecanism.type.length + 1))
      };
    }
  });
  if (result) {
    return result;
  }
  throw new _yerror2['default']('E_UNKNOWN_AUTH_MECANISM', header);
};
exports.parseAuthorizationHeader = parseAuthorizationHeader;