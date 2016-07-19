'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _neatequal = require('neatequal');

var _neatequal2 = _interopRequireDefault(_neatequal);

var _bearer = require('./bearer');

var _bearer2 = _interopRequireDefault(_bearer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('BEARER', function () {

  describe('type', function () {

    it('should be the basic auth prefix', function () {
      _assert2.default.equal(_bearer2.default.type, 'Bearer');
    });
  });

  describe('parseWWWAuthenticateRest', function () {

    it('should work', function () {
      (0, _neatequal2.default)(_bearer2.default.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
        realm: 'perlinpinpin'
      });
    });
  });

  describe('buildWWWAuthenticateRest', function () {

    it('should work', function () {
      _assert2.default.equal(_bearer2.default.buildWWWAuthenticateRest({
        realm: 'perlinpinpin'
      }), 'realm="perlinpinpin"');
    });

    it('should be the inverse of parseWWWAuthenticateRest', function () {
      (0, _neatequal2.default)(_bearer2.default.parseWWWAuthenticateRest(_bearer2.default.buildWWWAuthenticateRest({
        realm: 'perlinpinpin'
      })), {
        realm: 'perlinpinpin'
      });
    });
  });

  describe('parseAuthorizationRest', function () {

    it('should work', function () {
      (0, _neatequal2.default)(_bearer2.default.parseAuthorizationRest('mF_9.B5f-4.1JqM'), {
        hash: 'mF_9.B5f-4.1JqM'
      });
    });
  });

  describe('buildAuthorizationRest', function () {

    it('should work', function () {
      _assert2.default.equal(_bearer2.default.buildAuthorizationRest({
        hash: 'mF_9.B5f-4.1JqM'
      }), 'mF_9.B5f-4.1JqM');
    });

    it('should be the inverse of parseAuthorizationRest', function () {
      (0, _neatequal2.default)(_bearer2.default.parseAuthorizationRest(_bearer2.default.buildAuthorizationRest({
        hash: 'mF_9.B5f-4.1JqM'
      })), {
        hash: 'mF_9.B5f-4.1JqM'
      });
    });
  });
});