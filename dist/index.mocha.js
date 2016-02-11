'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _neatequal = require('neatequal');

var _neatequal2 = _interopRequireDefault(_neatequal);

var _index = require('./index');

describe('index', function () {

  describe('parseWWWAuthenticateHeader', function () {

    it('should parse Basic headers', function () {
      (0, _neatequal2['default'])((0, _index.parseWWWAuthenticateHeader)('Basic realm="test"'), {
        type: 'Basic',
        data: {
          realm: 'test'
        }
      });
    });
  });

  describe('parseAuthorizationHeader', function () {

    it('should parse Basic headers', function () {
      (0, _neatequal2['default'])((0, _index.parseAuthorizationHeader)('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
        type: 'Basic',
        data: {
          username: 'Aladdin',
          password: 'open sesame',
          hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
        }
      });
      (0, _neatequal2['default'])((0, _index.parseAuthorizationHeader)('Basic bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA=='), {
        type: 'Basic',
        data: {
          username: 'nicolas.froidure@simplifield.com',
          password: 'test',
          hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA=='
        }
      });
    });
  });

  describe('mecanisms', function () {

    it('should export bot DIGEST and BASIC  mecanisms', function () {
      _assert2['default'].equal(_index.mecanisms.length, 2);
    });

    it('should export bot DIGEST and BASIC  mecanisms', function () {
      (0, _assert2['default'])(_index.BASIC);
      (0, _assert2['default'])(_index.DIGEST);
    });
  });
});