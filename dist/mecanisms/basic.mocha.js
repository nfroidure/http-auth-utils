'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _neatequal = require('neatequal');

var _neatequal2 = _interopRequireDefault(_neatequal);

var _basic = require('./basic');

var _basic2 = _interopRequireDefault(_basic);

describe('BASIC', function () {

  describe('type', function () {

    it('should be the basic auth prefix', function () {
      _assert2['default'].equal(_basic2['default'].type, 'Basic');
    });
  });

  describe('parseWWWAuthenticateRest', function () {

    it('should work', function () {
      (0, _neatequal2['default'])(_basic2['default'].parseWWWAuthenticateRest('realm="perlinpinpin"'), {
        realm: 'perlinpinpin'
      });
    });
  });

  describe('buildWWWAuthenticateRest', function () {

    it('should work', function () {
      _assert2['default'].equal(_basic2['default'].buildWWWAuthenticateRest({
        realm: 'perlinpinpin'
      }), 'realm="perlinpinpin"');
    });

    it('should be the inverse of parseWWWAuthenticateRest', function () {
      (0, _neatequal2['default'])(_basic2['default'].parseWWWAuthenticateRest(_basic2['default'].buildWWWAuthenticateRest({
        realm: 'perlinpinpin'
      })), {
        realm: 'perlinpinpin'
      });
    });
  });

  describe('parseAuthorizationRest', function () {

    it('should work', function () {
      (0, _neatequal2['default'])(_basic2['default'].parseAuthorizationRest('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
        hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
        username: 'Aladdin',
        password: 'open sesame'
      });
      (0, _neatequal2['default'])(_basic2['default'].parseAuthorizationRest('bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA=='), {
        hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        username: 'nicolas.froidure@simplifield.com',
        password: 'test'
      });
    });
  });

  describe('buildAuthorizationRest', function () {

    it('should work with credentials', function () {
      _assert2['default'].equal(_basic2['default'].buildAuthorizationRest({
        username: 'Aladdin',
        password: 'open sesame'
      }), 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    });

    it('should work with just the hash', function () {
      _assert2['default'].equal(_basic2['default'].buildAuthorizationRest({
        hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
      }), 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    });

    it('should be the inverse of parseAuthorizationRest', function () {
      (0, _neatequal2['default'])(_basic2['default'].parseAuthorizationRest(_basic2['default'].buildAuthorizationRest({
        hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
        username: 'Aladdin',
        password: 'open sesame'
      })), {
        hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
        username: 'Aladdin',
        password: 'open sesame'
      });
    });
  });

  describe('computeHash', function () {

    it('should work', function () {
      _assert2['default'].equal(_basic2['default'].computeHash({
        username: 'Aladdin',
        password: 'open sesame'
      }), 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    });
  });

  describe('decodeHash', function () {

    it('should work', function () {
      (0, _neatequal2['default'])(_basic2['default'].decodeHash('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
        username: 'Aladdin',
        password: 'open sesame'
      });
    });
  });
});