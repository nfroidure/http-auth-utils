import { describe, test } from '@jest/globals';
import assert from 'assert';
import neatequal from 'neatequal';
import BASIC from './basic.js';

describe('BASIC', () => {
  describe('type', () => {
    test('should be the basic auth prefix', () => {
      assert.equal(BASIC.type, 'Basic');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    test('should work', () => {
      neatequal(BASIC.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
        realm: 'perlinpinpin',
      });
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    test('should work', () => {
      assert.equal(
        BASIC.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
        }),
        'realm="perlinpinpin"',
      );
    });

    test('should be the inverse of parseWWWAuthenticateRest', () => {
      neatequal(
        BASIC.parseWWWAuthenticateRest(
          BASIC.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
          }),
        ),
        {
          realm: 'perlinpinpin',
        },
      );
    });
  });

  describe('parseAuthorizationRest', () => {
    test('should work', () => {
      neatequal(BASIC.parseAuthorizationRest('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
        hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        username: 'Ali Baba',
        password: 'open sesame',
      });
      neatequal(
        BASIC.parseAuthorizationRest(
          'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        ),
        {
          hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
          username: 'nicolas.froidure@simplifield.com',
          password: 'test',
        },
      );
    });

    test('should fail with empty rest', () => {
      assert.throws(() => BASIC.parseAuthorizationRest(''), /E_EMPTY_AUTH/);
    });
  });

  describe('buildAuthorizationRest', () => {
    test('should work with credentials', () => {
      assert.equal(
        BASIC.buildAuthorizationRest({
          username: 'Ali Baba',
          password: 'open sesame',
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
      );
    });

    test('should work with just the hash', () => {
      assert.equal(
        BASIC.buildAuthorizationRest({
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
      );
    });

    test('should fail with nothing at all', () => {
      assert.throws(() => BASIC.buildAuthorizationRest({} as any), /E_NO_HASH/);
    });

    test('should be the inverse of parseAuthorizationRest', () => {
      neatequal(
        BASIC.parseAuthorizationRest(
          BASIC.buildAuthorizationRest({
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
            username: 'Ali Baba',
            password: 'open sesame',
          }),
        ),
        {
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          username: 'Ali Baba',
          password: 'open sesame',
        },
      );
    });
  });

  describe('computeHash', () => {
    test('should work', () => {
      assert.equal(
        BASIC.computeHash({
          username: 'Ali Baba',
          password: 'open sesame',
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
      );
    });
  });

  describe('decodeHash', () => {
    test('should work', () => {
      neatequal(BASIC.decodeHash('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
        username: 'Ali Baba',
        password: 'open sesame',
      });
    });
  });
});
