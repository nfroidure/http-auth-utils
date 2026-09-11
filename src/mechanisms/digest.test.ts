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
            'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
            'charset=UTF-8, ' +
            'userhash=TRUE',
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        charset: 'UTF-8',
        userhash: 'true',
      });
    });

    test('should upper case charset', () => {
      expect(
        DIGEST.parseWWWAuthenticateRest(
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
            'charset=utf-8, ' +
            'userhash=TRUE',
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        charset: 'UTF-8',
        userhash: 'true',
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

    test('should fail with bad charset', () => {
      expect(() =>
        DIGEST.parseWWWAuthenticateRest(
          'realm="testrealm@host.com", ' +
            'qop=auth, ' +
            'algorithm=MD5, ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",' +
            'charset=UCS-2',
        ),
      ).toThrow('E_UNSUPPORTED_VALUE');
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
          stale: 'false',
          algorithm: 'MD5',
          charset: 'UTF-8',
          userhash: 'true',
        }),
      ).toEqual(
        'realm="testrealm@host.com", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
          'stale=false, ' +
          'algorithm=MD5, ' +
          'qop="auth, auth-int", ' +
          'charset=UTF-8, ' +
          'userhash=true',
      );
    });

    test('should uppercase charset and lowercase userhash', () => {
      expect(
        DIGEST.buildWWWAuthenticateRest({
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          stale: 'FALSE' as 'false',
          algorithm: 'SHA-256',
          charset: 'utf-8' as 'UTF-8',
          userhash: 'TRUE' as 'true',
        }),
      ).toEqual(
        'realm="testrealm@host.com", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
          'stale=false, ' +
          'algorithm=SHA-256, ' +
          'qop="auth, auth-int", ' +
          'charset=UTF-8, ' +
          'userhash=true',
      );
    });

    test('should fail with bad charset', () => {
      expect(() =>
        DIGEST.buildWWWAuthenticateRest({
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          stale: 'false',
          algorithm: 'MD5',
          charset: 'UCS-2' as 'UTF-8',
          userhash: 'true',
        }),
      ).toThrow('E_UNSUPPORTED_VALUE');
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
            'qop=auth,' +
            'nc=00000001,' +
            'cnonce="0a4f113b",' +
            'response="6629fae49393a05397450978507c4ef1",' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41",' +
            'userhash=TRUE',
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
        userhash: 'true',
      });
    });

    test('should fail with bad nc', () => {
      expect(() => DIGEST.parseAuthorizationRest(
          'username="Mufasa",' +
            'realm="testrealm@host.com",' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",' +
            'uri="/dir/index.html",' +
            'qop=auth,' +
            'nc=1,' +
            'cnonce="0a4f113b",' +
            'response="6629fae49393a05397450978507c4ef1",' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41",' +
            'userhash=TRUE',
        )).toThrow(
        /E_INVALID_VALUE/,
      );
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
          algorithm: 'MD5',
          qop: 'auth',
          nc: '00000001',
          cnonce: '0a4f113b',
          response: '6629fae49393a05397450978507c4ef1',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          userhash: 'true',
        }),
      ).toEqual(
        'username="Mufasa", ' +
          'realm="testrealm@host.com", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'uri="/dir/index.html", ' +
          'response="6629fae49393a05397450978507c4ef1", ' +
          'algorithm=MD5, ' +
          'cnonce="0a4f113b", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
          'qop=auth, ' +
          'nc=00000001, ' +
          'userhash=true',
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
    const data = {
      username: 'Mufasa',
      realm: 'testrealm@host.com',
      password: 'Circle Of Life',
      method: 'GET',
      uri: '/dir/index.html',
      nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
      nc: '00000001',
      cnonce: '0a4f113b',
      qop: 'auth',
    };

    test.each([
      ['md5', '6629fae49393a05397450978507c4ef1'],
      ['MD5-sess', '8e3825c57e897f5a0dec6c2d4e5059d0'],
      [
        'SHA-256',
        '5abdd07184ba512a22c53f41470e5eea7dcaa3a93a59b630c13dfe0a5dc6e38b',
      ],
      [
        'SHA-256-sess',
        'b8822e12417cb7750f4e2b8515f0dcf25b7dd26993e80bee1426201446a7f59b',
      ],
      [
        'SHA-512-256',
        'f23c08ec7334a881f8286e68450ddbd9f0cd91c41481f0e1433604da8113c6dc',
      ],
      [
        'SHA-512-256-sess',
        '0d21f0db3ec5cda5b850c0afa3bc29b4a3c5a6191959ff1baf511d4b38eb6b1e',
      ],
    ])('should support the %s algorithm', (algorithm, expectedHash) => {
      expect(
        DIGEST.computeHash({
          ...data,
          algorithm,
        }),
      ).toEqual(expectedHash);
    });

    test('should apply -sess over a provided ha1 value', () => {
      expect(
        DIGEST.computeHash({
          ...data,
          ha1: '939e7578ed9e3c518a452acee763bce9',
          algorithm: 'MD5-sess',
        }),
      ).toEqual('8e3825c57e897f5a0dec6c2d4e5059d0');
    });
  });
});
