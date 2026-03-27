import { describe, test, expect } from '@jest/globals';
import BASIC, { BasicAuthorizationData } from './basic.js';

describe('BASIC', () => {
  describe('type', () => {
    test('should be the basic auth prefix', () => {
      expect(BASIC.type).toEqual('Basic');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    test('should work', () => {
      expect(BASIC.parseWWWAuthenticateRest('realm="perlinpinpin"')).toEqual({
        realm: 'perlinpinpin',
      });
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    test('should work', () => {
      expect(
        BASIC.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
        }),
      ).toEqual('realm="perlinpinpin"');
    });

    test('should be the inverse of parseWWWAuthenticateRest', () => {
      expect(
        BASIC.parseWWWAuthenticateRest(
          BASIC.buildWWWAuthenticateRest({
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
      expect(
        BASIC.parseAuthorizationRest('QWxpIEJhYmE6b3BlbiBzZXNhbWU='),
      ).toEqual({
        hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        username: 'Ali Baba',
        password: 'open sesame',
      });
      expect(
        BASIC.parseAuthorizationRest(
          'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        ),
      ).toEqual({
        hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        username: 'nicolas.froidure@simplifield.com',
        password: 'test',
      });
    });

    test('should fail with empty rest', () => {
      expect(() => BASIC.parseAuthorizationRest('')).toThrow(/E_EMPTY_AUTH/);
    });
  });

  describe('buildAuthorizationRest', () => {
    test('should work with credentials', () => {
      expect(
        BASIC.buildAuthorizationRest({
          username: 'Ali Baba',
          password: 'open sesame',
        }),
      ).toEqual('QWxpIEJhYmE6b3BlbiBzZXNhbWU=');
    });

    test('should work with just the hash', () => {
      expect(
        BASIC.buildAuthorizationRest({
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        }),
      ).toEqual('QWxpIEJhYmE6b3BlbiBzZXNhbWU=');
    });

    test('should fail with nothing at all', () => {
      expect(() =>
        BASIC.buildAuthorizationRest({} as unknown as BasicAuthorizationData),
      ).toThrow(/E_NO_HASH/);
    });

    test('should be the inverse of parseAuthorizationRest', () => {
      expect(
        BASIC.parseAuthorizationRest(
          BASIC.buildAuthorizationRest({
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
            username: 'Ali Baba',
            password: 'open sesame',
          }),
        ),
      ).toEqual({
        hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        username: 'Ali Baba',
        password: 'open sesame',
      });
    });
  });

  describe('computeHash', () => {
    test('should work', () => {
      expect(
        BASIC.computeHash({
          username: 'Ali Baba',
          password: 'open sesame',
        }),
      ).toEqual('QWxpIEJhYmE6b3BlbiBzZXNhbWU=');
    });
  });

  describe('decodeHash', () => {
    test('should work', () => {
      expect(BASIC.decodeHash('QWxpIEJhYmE6b3BlbiBzZXNhbWU=')).toEqual({
        username: 'Ali Baba',
        password: 'open sesame',
      });
    });
  });
});
