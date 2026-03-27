import { describe, test, expect } from '@jest/globals';
import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet,
} from './utils.js';

describe('utils', () => {
  describe('parseHTTPHeadersQuotedKeyValueSet', () => {
    test('should work with good datas', () => {
      expect(
        parseHTTPHeadersQuotedKeyValueSet(
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce', 'opaque'],
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
      });
    });

    test('should work with empty opaque', () => {
      expect(
        parseHTTPHeadersQuotedKeyValueSet(
          'qop="auth", ' +
            'realm="DS-DD8D92DB", ' +
            'nonce="NzhiYWNkMGY3ZmVjZGZkNjA1NzE0NzcxYzA4MTBmNjM=", ' +
            'stale="false", ' +
            'opaque="", ' +
            'domain="::"',
          ['realm', 'qop', 'nonce', 'opaque', 'stale', 'domain'],
          ['realm', 'qop', 'nonce', 'opaque', 'stale', 'domain'],
        ),
      ).toEqual({
        realm: 'DS-DD8D92DB',
        qop: 'auth',
        nonce: 'NzhiYWNkMGY3ZmVjZGZkNjA1NzE0NzcxYzA4MTBmNjM=',
        opaque: '',
        stale: 'false',
        domain: '::',
      });
    });

    test('should work with equals in key values', () => {
      expect(
        parseHTTPHeadersQuotedKeyValueSet(
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dGVzdCBzdHJpbmc=", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce', 'opaque'],
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dGVzdCBzdHJpbmc=',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
      });
    });

    test('should work with parse-able non-quoted data', () => {
      expect(
        parseHTTPHeadersQuotedKeyValueSet(
          'realm="testrealm@host.com", ' +
            'qop=auth, ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce', 'opaque'],
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
      });
    });

    test('should normalize all keys to lowercase', () => {
      expect(
        parseHTTPHeadersQuotedKeyValueSet(
          'Realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
            'Stale="false"',
          ['realm', 'qop', 'nonce', 'opaque', 'stale'],
          ['realm', 'qop', 'nonce', 'opaque', 'stale'],
        ),
      ).toEqual({
        realm: 'testrealm@host.com',
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        stale: 'false',
      });
    });

    test('should normalize values to lowercase for given keys', () => {
      expect(
        parseHTTPHeadersQuotedKeyValueSet(
          'realm="testrealm-UPPERCASE@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
            'stale=TRUE',
          ['realm', 'qop', 'nonce', 'opaque', 'stale'],
          ['realm', 'qop', 'nonce', 'opaque', 'stale'],
          ['stale'],
        ),
      ).toEqual({
        realm: 'testrealm-UPPERCASE@host.com', // should not be changed
        qop: 'auth, auth-int',
        nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
        opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        stale: 'true',
      });
    });

    test('should fail with bad quoted value pair', () => {
      expect(() => parseHTTPHeadersQuotedKeyValueSet('realm', [])).toThrow(
        /E_MALFORMED_QUOTEDKEYVALUE/,
      );
    });

    test('should fail with half-quoted value pair', () => {
      expect(() =>
        parseHTTPHeadersQuotedKeyValueSet('realm="uneven', ['realm']),
      ).toThrow(/E_MALFORMED_QUOTEDKEYVALUE/);
    });

    test('should fail with bad quoted value pair', () => {
      expect(() =>
        parseHTTPHeadersQuotedKeyValueSet('realm="dsad"', []),
      ).toThrow(/E_UNAUTHORIZED_KEY/);
    });

    test('should pass with non-quoted value pair', () => {
      expect(
        parseHTTPHeadersQuotedKeyValueSet('realm=dsad', ['realm']),
      ).toEqual({
        realm: 'dsad',
      });
    });
  });

  describe('buildHTTPHeadersQuotedKeyValueSet', () => {
    test('should work with good datas', () => {
      expect(
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
            nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          },
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce'],
        ),
      ).toEqual(
        'realm="testrealm@host.com", ' +
          'qop="auth, auth-int", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"',
      );
    });

    test('should work with empty value', () => {
      expect(
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
            opaque: '',
          },
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'opaque'],
        ),
      ).toEqual(
        'realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'opaque=""',
      );
    });

    test('should work with unused keys', () => {
      expect(
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
            nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
            opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          },
          ['realm', 'qop', 'nonce'],
        ),
      ).toEqual(
        'realm="testrealm@host.com", ' +
          'qop="auth, auth-int", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"',
      );
    });

    test('should fail without required keys', () => {
      expect(() =>
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
          },
          ['realm', 'qop', 'nonce'],
          ['realm', 'qop', 'nonce'],
        ),
      ).toThrow(/E_REQUIRED_KEY/);
    });
  });
});
