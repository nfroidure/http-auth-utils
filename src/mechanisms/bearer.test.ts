import { describe, test } from '@jest/globals';
import assert from 'assert';
import neatequal from 'neatequal';
import BEARER from './bearer.js';

describe('BEARER', () => {
  describe('type', () => {
    test('should be the basic auth prefix', () => {
      assert.equal(BEARER.type, 'Bearer');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    test('should work', () => {
      neatequal(BEARER.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
        realm: 'perlinpinpin',
      });
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    test('should work', () => {
      assert.equal(
        BEARER.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
        }),
        'realm="perlinpinpin"',
      );
    });

    test('should work with an error', () => {
      assert.equal(
        BEARER.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
          error: 'invalid_request',
          error_description: 'The access token expired',
        }),
        'realm="perlinpinpin", ' +
          'error="invalid_request", ' +
          'error_description="The access token expired"',
      );
    });

    test('should fail with an unauthorized error', () => {
      assert.throws(
        () =>
          BEARER.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
            error: 'invalid_tacos',
            error_description: 'The tacos has been eaten yet',
          } as any),
        /E_INVALID_ERROR/,
      );
    });

    test('should be the inverse of parseWWWAuthenticateRest', () => {
      neatequal(
        BEARER.parseWWWAuthenticateRest(
          BEARER.buildWWWAuthenticateRest({
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
      neatequal(BEARER.parseAuthorizationRest('mF_9.B5f-4.1JqM'), {
        hash: 'mF_9.B5f-4.1JqM',
      });
    });

    test('should fail with empty rest', () => {
      assert.throws(() => BEARER.parseAuthorizationRest(''), /E_EMPTY_AUTH/);
    });
  });

  describe('buildAuthorizationRest', () => {
    test('should work', () => {
      assert.equal(
        BEARER.buildAuthorizationRest({
          hash: 'mF_9.B5f-4.1JqM',
        }),
        'mF_9.B5f-4.1JqM',
      );
    });

    test('should fail with nothing at all', () => {
      assert.throws(
        () => BEARER.buildAuthorizationRest({} as any),
        /E_NO_HASH/,
      );
    });

    test('should be the inverse of parseAuthorizationRest', () => {
      neatequal(
        BEARER.parseAuthorizationRest(
          BEARER.buildAuthorizationRest({
            hash: 'mF_9.B5f-4.1JqM',
          }),
        ),
        {
          hash: 'mF_9.B5f-4.1JqM',
        },
      );
    });
  });
});
