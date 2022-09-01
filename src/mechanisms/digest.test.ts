import { describe, test } from '@jest/globals';
import assert from 'assert';
import neatequal from 'neatequal';
import DIGEST from './digest.js';

describe('digest', () => {
  describe('type', () => {
    test('should be the digest auth prefix', () => {
      assert.equal(DIGEST.type, 'Digest');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    test('should work', () => {
      neatequal(
        DIGEST.parseWWWAuthenticateRest(
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
        ),
        {
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        },
      );
    });

    test('should handle non-quoted fields', () => {
      neatequal(
        DIGEST.parseWWWAuthenticateRest(
          'realm="testrealm@host.com", ' +
            'qop=auth, ' +
            'algorithm=MD5, ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"',
        ),
        {
          realm: 'testrealm@host.com',
          qop: 'auth',
          algorithm: 'MD5',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        },
      );
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    test('should work', () => {
      assert.equal(
        DIGEST.buildWWWAuthenticateRest({
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        }),
        'realm="testrealm@host.com", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
          'qop="auth, auth-int"',
      );
    });

    test('should be the inverse of parseWWWAuthenticateRest', () => {
      neatequal(
        DIGEST.parseWWWAuthenticateRest(
          DIGEST.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
            nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          }),
        ),
        {
          realm: 'perlinpinpin',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        },
      );
    });
  });

  describe('parseAuthorizationRest', () => {
    test('should work', () => {
      neatequal(
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
        {
          username: 'Mufasa',
          realm: 'testrealm@host.com',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          uri: '/dir/index.html',
          qop: 'auth',
          nc: '00000001',
          cnonce: '0a4f113b',
          response: '6629fae49393a05397450978507c4ef1',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        },
      );
    });

    test('should fail with empty rest', () => {
      assert.throws(
        () => DIGEST.parseAuthorizationRest(''),
        /E_MALFORMED_QUOTEDKEYVALUE/,
      );
    });
  });

  describe('buildAuthorizationRest', () => {
    test('should work', () => {
      assert.equal(
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
      neatequal(
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
        {
          username: 'Mufasa',
          realm: 'testrealm@host.com',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          uri: '/dir/index.html',
          qop: 'auth',
          nc: '00000001',
          cnonce: '0a4f113b',
          response: '6629fae49393a05397450978507c4ef1',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        },
      );
    });
  });

  describe('computeHash', () => {
    test('should work', () => {
      assert.equal(
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
        '6629fae49393a05397450978507c4ef1',
      );
    });
  });
});
