import { describe, test } from '@jest/globals';
import assert from 'assert';
import neatequal from 'neatequal';
import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet,
} from './utils.js';

describe('utils', () => {
  describe('parseHTTPHeadersQuotedKeyValueSet', () => {
    test('should work with good datas', () => {
      neatequal(
        parseHTTPHeadersQuotedKeyValueSet(
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce', 'opaque'],
        ),
        {
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        },
      );
    });

    test('should work with empty opaque', () => {
      neatequal(
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
        {
          realm: 'DS-DD8D92DB',
          qop: 'auth',
          nonce: 'NzhiYWNkMGY3ZmVjZGZkNjA1NzE0NzcxYzA4MTBmNjM=',
          opaque: '',
          stale: 'false',
          domain: '::',
        },
      );
    });

    test('should work with equals in key values', () => {
      neatequal(
        parseHTTPHeadersQuotedKeyValueSet(
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dGVzdCBzdHJpbmc=", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce', 'opaque'],
        ),
        {
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dGVzdCBzdHJpbmc=',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        },
      );
    });

    test('should work with parse-able non-quoted data', () => {
      neatequal(
        parseHTTPHeadersQuotedKeyValueSet(
          'realm="testrealm@host.com", ' +
            'qop=auth, ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce', 'opaque'],
        ),
        {
          realm: 'testrealm@host.com',
          qop: 'auth',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        },
      );
    });

    test('should normalize all keys to lowercase', () => {
      neatequal(
        parseHTTPHeadersQuotedKeyValueSet(
          'Realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
            'opaque="5ccc069c403ebaf9f0171e9517f40e41", ' +
            'Stale="false"',
          ['realm', 'qop', 'nonce', 'opaque', 'stale'],
          ['realm', 'qop', 'nonce', 'opaque', 'stale'],
        ),
        {
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          stale: 'false',
        },
      );
    });

    test('should normalize values to lowercase for given keys', () => {
      neatequal(
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
        {
          realm: 'testrealm-UPPERCASE@host.com', // should not be changed
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          stale: 'true',
        },
      );
    });

    test('should fail with bad quoted value pair', () => {
      assert.throws(
        () => parseHTTPHeadersQuotedKeyValueSet('realm', []),
        /E_MALFORMED_QUOTEDKEYVALUE/,
      );
    });

    test('should fail with half-quoted value pair', () => {
      assert.throws(
        () => parseHTTPHeadersQuotedKeyValueSet('realm="uneven', ['realm']),
        /E_MALFORMED_QUOTEDKEYVALUE/,
      );
    });

    test('should fail with bad quoted value pair', () => {
      assert.throws(
        () => parseHTTPHeadersQuotedKeyValueSet('realm="dsad"', []),
        /E_UNAUTHORIZED_KEY/,
      );
    });

    test('should pass with non-quoted value pair', () => {
      neatequal(parseHTTPHeadersQuotedKeyValueSet('realm=dsad', ['realm']), {
        realm: 'dsad',
      });
    });
  });

  describe('buildHTTPHeadersQuotedKeyValueSet', () => {
    test('should work with good datas', () => {
      assert.equal(
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
            nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          },
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'nonce'],
        ),
        'realm="testrealm@host.com", ' +
          'qop="auth, auth-int", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"',
      );
    });

    test('should work with empty value', () => {
      assert.equal(
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
            opaque: '',
          },
          ['realm', 'qop', 'nonce', 'opaque'],
          ['realm', 'qop', 'opaque'],
        ),
        'realm="testrealm@host.com", ' + 'qop="auth, auth-int", ' + 'opaque=""',
      );
    });

    test('should work with unused keys', () => {
      assert.equal(
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
            nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
            opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          },
          ['realm', 'qop', 'nonce'],
        ),
        'realm="testrealm@host.com", ' +
          'qop="auth, auth-int", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"',
      );
    });

    test('should fail without required keys', () => {
      assert.throws(
        () =>
          buildHTTPHeadersQuotedKeyValueSet(
            {
              realm: 'testrealm@host.com',
              qop: 'auth, auth-int',
            },
            ['realm', 'qop', 'nonce'],
            ['realm', 'qop', 'nonce'],
          ),
        /E_REQUIRED_KEY/,
      );
    });
  });
});
