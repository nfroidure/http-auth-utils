import { describe, test, expect } from '@jest/globals';
import DIGEST from './digest.js';

describe('digest', () => {
  describe('type', () => {
    test('should be the digest auth prefix', () => {
      expect(DIGEST.type).toEqual('Digest');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    test('should work', () => {
      expect(
        DIGEST.parseWWWAuthenticateRest(
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
      });
    });

    test('should handle non-quoted fields', () => {
      expect(
        DIGEST.parseWWWAuthenticateRest(
          'realm="testrealm@host.com", ' +
            'qop=auth, ' +
            'algorithm=MD5, ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"',
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth',
        algorithm: 'MD5',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
      });
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    test('should work', () => {
      expect(
        DIGEST.buildWWWAuthenticateRest({
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        }),
      ).toEqual(
        'realm="testrealm@host.com", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
          'qop="auth, auth-int"',
      );
    });

    test('should be the inverse of parseWWWAuthenticateRest', () => {
      expect(
        DIGEST.parseWWWAuthenticateRest(
          DIGEST.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
            nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          }),
        ),
      ).toEqual({
        realm: 'perlinpinpin',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
      });
    });
  });

  describe('parseAuthorizationRest', () => {
    test('should work', () => {
      expect(
        DIGEST.parseAuthorizationRest(
          'username="Mufasa",' +
            'realm="testrealm@host.com",' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",' +
            'uri="/dir/index.html",' +
            'qop="auth",' +
            'nc="00000001",' +
            'cnonce="0a4f113b",' +
            'response="6629fae49393a05397450978507c4ef1",' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
        ),
      ).toEqual({
        username: 'Mufasa',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        uri: '/dir/index.html',
        qop: 'auth',
        nc: '00000001',
        cnonce: '0a4f113b',
        response: '6629fae49393a05397450978507c4ef1',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
      });
    });

    test('should fail with empty rest', () => {
      expect(() => DIGEST.parseAuthorizationRest('')).toThrow(
        /E_MALFORMED_QUOTEDKEYVALUE/,
      );
    });
  });

  describe('buildAuthorizationRest', () => {
    test('should work', () => {
      expect(
        DIGEST.buildAuthorizationRest({
          username: 'Mufasa',
          realm: 'testrealm@host.com',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          uri: '/dir/index.html',
          qop: 'auth',
          nc: '00000001',
          cnonce: '0a4f113b',
          response: '6629fae49393a05397450978507c4ef1',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        }),
      ).toEqual(
        'username="Mufasa", ' +
          'realm="testrealm@host.com", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'uri="/dir/index.html", ' +
          'response="6629fae49393a05397450978507c4ef1", ' +
          'cnonce="0a4f113b", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
          'qop="auth", ' +
          'nc="00000001"',
      );
    });

    test('should be the inverse of parseAuthorizationRest', () => {
      expect(
        DIGEST.parseAuthorizationRest(
          DIGEST.buildAuthorizationRest({
            username: 'Mufasa',
            realm: 'testrealm@host.com',
            nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
            uri: '/dir/index.html',
            qop: 'auth',
            nc: '00000001',
            cnonce: '0a4f113b',
            response: '6629fae49393a05397450978507c4ef1',
            opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          }),
        ),
      ).toEqual({
        username: 'Mufasa',
        realm: 'testrealm@host.com',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        uri: '/dir/index.html',
        qop: 'auth',
        nc: '00000001',
        cnonce: '0a4f113b',
        response: '6629fae49393a05397450978507c4ef1',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
      });
    });
  });

  describe('computeHash', () => {
    test('should work', () => {
      expect(
        DIGEST.computeHash({
          username: 'Mufasa',
          realm: 'testrealm@host.com',
          password: 'Circle Of Life',
          method: 'GET',
          uri: '/dir/index.html',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          nc: '00000001',
          cnonce: '0a4f113b',
          qop: 'auth',
          algorithm: 'md5',
        }),
      ).toEqual('6629fae49393a05397450978507c4ef1');
    });
  });
});
