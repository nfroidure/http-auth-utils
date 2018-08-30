'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _neatequal = require('neatequal');

var _neatequal2 = _interopRequireDefault(_neatequal);

var _digest = require('./digest');

var _digest2 = _interopRequireDefault(_digest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('digest', function () {
  describe('type', function () {
    it('should be the digest auth prefix', function () {
      _assert2.default.equal(_digest2.default.type, 'Digest');
    });
  });

  describe('parseWWWAuthenticateRest', function () {
    it('should work', function () {
      (0, _neatequal2.default)(_digest2.default.parseWWWAuthenticateRest('realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' + 'opaque="5ccc069c403ebaf9f0171e9517f40e41"'), {
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      });
    });
  });

  describe('buildWWWAuthenticateRest', function () {
    it('should work', function () {
      _assert2.default.equal(_digest2.default.buildWWWAuthenticateRest({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      }), 'realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' + 'opaque="5ccc069c403ebaf9f0171e9517f40e41"');
    });

    it('should be the inverse of parseWWWAuthenticateRest', function () {
      (0, _neatequal2.default)(_digest2.default.parseWWWAuthenticateRest(_digest2.default.buildWWWAuthenticateRest({
        realm: 'perlinpinpin'
      })), {
        realm: 'perlinpinpin'
      });
    });
  });

  describe('parseAuthorizationRest', function () {
    it('should work', function () {
      (0, _neatequal2.default)(_digest2.default.parseAuthorizationRest('username="Mufasa",' + 'realm="testrealm@host.com",' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",' + 'uri="/dir/index.html",' + 'qop="auth",' + 'nc="00000001",' + 'cnonce="0a4f113b",' + 'response="6629fae49393a05397450978507c4ef1",' + 'opaque="5ccc069c403ebaf9f0171e9517f40e41"'), {
        username: 'Mufasa',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        uri: '/dir/index.html',
        qop: 'auth',
        nc: '00000001',
        cnonce: '0a4f113b',
        response: '6629fae49393a05397450978507c4ef1',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      });
    });
  });

  describe('buildAuthorizationRest', function () {
    it('should work', function () {
      _assert2.default.equal(_digest2.default.buildAuthorizationRest({
        username: 'Mufasa',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        uri: '/dir/index.html',
        qop: 'auth',
        nc: '00000001',
        cnonce: '0a4f113b',
        response: '6629fae49393a05397450978507c4ef1',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      }), 'username="Mufasa", ' + 'realm="testrealm@host.com", ' + 'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' + 'uri="/dir/index.html", ' + 'response="6629fae49393a05397450978507c4ef1", ' + 'cnonce="0a4f113b", ' + 'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' + 'qop="auth", ' + 'nc="00000001"');
    });

    it('should be the inverse of parseAuthorizationRest', function () {
      (0, _neatequal2.default)(_digest2.default.parseAuthorizationRest(_digest2.default.buildAuthorizationRest({
        username: 'Mufasa',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        uri: '/dir/index.html',
        qop: 'auth',
        nc: '00000001',
        cnonce: '0a4f113b',
        response: '6629fae49393a05397450978507c4ef1',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      })), {
        username: 'Mufasa',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        uri: '/dir/index.html',
        qop: 'auth',
        nc: '00000001',
        cnonce: '0a4f113b',
        response: '6629fae49393a05397450978507c4ef1',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41'
      });
    });
  });

  describe('computeHash', function () {
    it('should work', function () {
      _assert2.default.equal(_digest2.default.computeHash({
        username: 'Mufasa',
        realm: 'testrealm@host.com',
        password: 'Circle Of Life',
        method: 'GET',
        uri: '/dir/index.html',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        nc: '00000001',
        cnonce: '0a4f113b',
        qop: 'auth',
        algorithm: 'md5'
      }), '6629fae49393a05397450978507c4ef1');
    });
  });
});