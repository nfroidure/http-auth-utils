import { describe, test, expect } from '@jest/globals';
import BEARER, {
  BearerAuthorizationData,
  BearerWWWAuthenticateData,
} from './bearer.js';

describe('BEARER', () => {
  describe('type', () => {
    test('should be the basic auth prefix', () => {
      expect(BEARER.type).toEqual('Bearer');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    test('should work', () => {
      expect(BEARER.parseWWWAuthenticateRest('realm="perlinpinpin"')).toEqual({
        realm: 'perlinpinpin',
      });
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    test('should work', () => {
      expect(
        BEARER.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
        }),
      ).toEqual('realm="perlinpinpin"');
    });

    test('should work with an error', () => {
      expect(
        BEARER.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
          error: 'invalid_request',
          error_description: 'The access token expired',
        }),
      ).toEqual(
        'realm="perlinpinpin", ' +
          'error="invalid_request", ' +
          'error_description="The access token expired"',
      );
    });

    test('should fail with an unauthorized error', () => {
      expect(() =>
        BEARER.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
          error: 'invalid_tacos',
          error_description: 'The tacos has been eaten yet',
        } as unknown as BearerWWWAuthenticateData),
      ).toThrow(/E_INVALID_ERROR/);
    });

    test('should be the inverse of parseWWWAuthenticateRest', () => {
      expect(
        BEARER.parseWWWAuthenticateRest(
          BEARER.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
          }),
        ),
      ).toEqual({
        realm: 'perlinpinpin',
      });
    });
  });

  describe('parseAuthorizationRest', () => {
    test('should work', () => {
      expect(BEARER.parseAuthorizationRest('mF_9.B5f-4.1JqM')).toEqual({
        hash: 'mF_9.B5f-4.1JqM',
      });
    });

    test('should fail with empty rest', () => {
      expect(() => BEARER.parseAuthorizationRest('')).toThrow(/E_EMPTY_AUTH/);
    });
  });

  describe('buildAuthorizationRest', () => {
    test('should work', () => {
      expect(
        BEARER.buildAuthorizationRest({
          hash: 'mF_9.B5f-4.1JqM',
        }),
      ).toEqual('mF_9.B5f-4.1JqM');
    });

    test('should fail with nothing at all', () => {
      expect(() =>
        BEARER.buildAuthorizationRest({} as unknown as BearerAuthorizationData),
      ).toThrow(/E_NO_HASH/);
    });

    test('should be the inverse of parseAuthorizationRest', () => {
      expect(
        BEARER.parseAuthorizationRest(
          BEARER.buildAuthorizationRest({
            hash: 'mF_9.B5f-4.1JqM',
          }),
        ),
      ).toEqual({
        hash: 'mF_9.B5f-4.1JqM',
      });
    });
  });
});
