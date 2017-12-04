import assert from 'assert';
import neatequal from 'neatequal';
import {
  parseWWWAuthenticateHeader,
  parseAuthorizationHeader,
  mecanisms,
  BASIC,
  DIGEST,
  BEARER,
} from './index';

describe('index', () => {
  describe('parseWWWAuthenticateHeader', () => {
    it('should parse Basic headers', () => {
      neatequal(parseWWWAuthenticateHeader('Basic realm="test"'), {
        type: 'Basic',
        data: {
          realm: 'test',
        },
      });
    });
  });

  describe('parseAuthorizationHeader', () => {
    it('should parse Basic headers', () => {
      neatequal(
        parseAuthorizationHeader('Basic QWxpIEJhYmE6b3BlbiBzZXNhbWU='),
        {
          type: 'Basic',
          data: {
            username: 'Ali Baba',
            password: 'open sesame',
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          },
        },
      );
      neatequal(
        parseAuthorizationHeader(
          'Basic bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        ),
        {
          type: 'Basic',
          data: {
            username: 'nicolas.froidure@simplifield.com',
            password: 'test',
            hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
          },
        },
      );
    });

    it('should parse Basic headers with a ":" char in the password', () => {
      neatequal(parseAuthorizationHeader('Basic Sm9objpSOlU6a2lkZGluZz8='), {
        type: 'Basic',
        data: {
          username: 'John',
          password: 'R:U:kidding?',
          hash: 'Sm9objpSOlU6a2lkZGluZz8=',
        },
      });
    });
  });

  describe('mecanisms', () => {
    it('should export bot DIGEST and BASIC  mecanisms', () => {
      assert.equal(mecanisms.length, 3);
    });

    it('should export DIGEST BASIC and BEARER mecanisms', () => {
      assert(BASIC);
      assert(DIGEST);
      assert(BEARER);
    });
  });
});
