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
