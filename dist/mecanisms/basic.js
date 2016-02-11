/**
 * @module http-auth-utils/mecanisms/basic
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _yerror = require('yerror');

var _yerror2 = _interopRequireDefault(_yerror);

var _utils = require('../utils');

var AUTHORIZED_WWW_AUTHENTICATE_KEYS = ['realm'];

/**
 * Basic authentication mecanism.
 * @type {Object}
 * @see http://tools.ietf.org/html/rfc2617#section-2
 */
var BASIC = {

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
    return (0, _utils.parseHTTPHeadersQuotedKeyValueSet)(rest, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
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
    return (0, _utils.buildHTTPHeadersQuotedKeyValueSet)(data, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },

  /**
   * Parse the Authorization header rest.
   * @param  {String} rest The header rest (string got after removing the authentication mecanism prefix).)
   * @return {Object}      Object representing the result of the parse operation {hash}.
   * @example
   * assert.deepEqual(
   *   BASIC.parseAuthorizationRest('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
   *     hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
   *     username: 'Aladdin',
   *     password: 'open sesame'
   *   }
   * );
   * @api public
   */
  parseAuthorizationRest: function parseAuthorizationRest(rest) {
    if (!rest) {
      throw new _yerror2['default']('E_EMPTY_AUTH');
    }

    var _BASIC$decodeHash = BASIC.decodeHash(rest);

    var username = _BASIC$decodeHash.username;
    var password = _BASIC$decodeHash.password;

    return {
      hash: rest,
      username: username,
      password: password
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
  buildAuthorizationRest: function buildAuthorizationRest() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var hash = _ref.hash;
    var username = _ref.username;
    var password = _ref.password;

    if (username && password) {
      return BASIC.computeHash({ username: username, password: password });
    }
    if (!hash) {
      throw new _yerror2['default']('E_NO_HASH');
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
   *     username: 'Aladdin',
   *     password: 'open sesame'
   *   }),
   *   'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
   * );
   * @api public
   */
  computeHash: function computeHash(_ref2) {
    var username = _ref2.username;
    var password = _ref2.password;

    return new Buffer(username + ':' + password).toString('base64');
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
    var _toString$split = new Buffer(hash, 'base64').toString().split(':');

    var _toString$split2 = _slicedToArray(_toString$split, 2);

    var username = _toString$split2[0];
    var password = _toString$split2[1];

    return {
      username: username,
      password: password
    };
  }
};

exports['default'] = BASIC;
module.exports = exports['default'];