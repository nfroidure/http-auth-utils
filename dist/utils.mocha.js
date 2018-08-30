'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _neatequal = require('neatequal');

var _neatequal2 = _interopRequireDefault(_neatequal);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('utils', function () {
  describe('parseHTTPHeadersQuotedKeyValueSet', function () {
    it('should work with good datas', function () {
      (0, _neatequal2.default)((0, _utils.parseHTTPHeadersQuotedKeyValueSet)('realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' + 'opaque="5ccc069c403ebaf9f0171e9517f40e41"', ['realm', 'qop', 'nonce', 'opaque'], ['realm', 'qop', 'nonce', 'opaque']), {
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      });
    });

    it('should fail with bad quoted value pair', function () {
      _assert2.default.throws(function () {
        return (0, _utils.parseHTTPHeadersQuotedKeyValueSet)('realm');
      }, /E_MALFORMED_QUOTEDKEYVALUE/);
    });

    it('should fail with bad quoted value pair', function () {
      _assert2.default.throws(function () {
        return (0, _utils.parseHTTPHeadersQuotedKeyValueSet)('realm="dsad"', []);
      }, /E_UNAUTHORIZED_KEY/);
    });

    it('should fail with bad quoted value pair', function () {
      _assert2.default.throws(function () {
        return (0, _utils.parseHTTPHeadersQuotedKeyValueSet)('realm=dsad', ['realm']);
      }, /E_UNQUOTED_VALUE/);
    });
  });

  describe('buildHTTPHeadersQuotedKeyValueSet', function () {
    it('should work with good datas', function () {
      _assert2.default.equal((0, _utils.buildHTTPHeadersQuotedKeyValueSet)({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093'
      }, ['realm', 'qop', 'nonce', 'opaque'], ['realm', 'qop', 'nonce']), 'realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"');
    });

    it('should fail with some unauthorized keys', function () {
      _assert2.default.equal((0, _utils.buildHTTPHeadersQuotedKeyValueSet)({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      }, ['realm', 'qop', 'nonce']), 'realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"');
    });

    it('should fail without required keys', function () {
      _assert2.default.throws(function () {
        return (0, _utils.buildHTTPHeadersQuotedKeyValueSet)({
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int'
        }, ['realm', 'qop', 'nonce'], ['realm', 'qop', 'nonce'], 'realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"', /E_UNQUOTED_VALUE/);
      });
    });
  });
});