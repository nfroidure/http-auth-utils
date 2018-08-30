'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _neatequal = require('neatequal');

var _neatequal2 = _interopRequireDefault(_neatequal);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('index', function () {
  describe('parseWWWAuthenticateHeader', function () {
    it('should parse Basic headers', function () {
      (0, _neatequal2.default)((0, _index.parseWWWAuthenticateHeader)('Basic realm="test"'), {
        type: 'Basic',
        data: {
          realm: 'test'
        }
      });
    });
  });

  describe('parseAuthorizationHeader', function () {
    it('should parse Basic headers', function () {
      (0, _neatequal2.default)((0, _index.parseAuthorizationHeader)('Basic QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
        type: 'Basic',
        data: {
          username: 'Ali Baba',
          password: 'open sesame',
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
        }
      });
      (0, _neatequal2.default)((0, _index.parseAuthorizationHeader)('Basic bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA=='), {
        type: 'Basic',
        data: {
          username: 'nicolas.froidure@simplifield.com',
          password: 'test',
          hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA=='
        }
      });
    });

    it('should parse Basic headers with a ":" char in the password', function () {
      (0, _neatequal2.default)((0, _index.parseAuthorizationHeader)('Basic Sm9objpSOlU6a2lkZGluZz8='), {
        type: 'Basic',
        data: {
          username: 'John',
          password: 'R:U:kidding?',
          hash: 'Sm9objpSOlU6a2lkZGluZz8='
        }
      });
    });
  });

  describe('mecanisms', function () {
    it('should export bot DIGEST and BASIC  mecanisms', function () {
      _assert2.default.equal(_index.mecanisms.length, 3);
    });

    it('should export DIGEST BASIC and BEARER mecanisms', function () {
      (0, _assert2.default)(_index.BASIC);
      (0, _assert2.default)(_index.DIGEST);
      (0, _assert2.default)(_index.BEARER);
    });
  });
});