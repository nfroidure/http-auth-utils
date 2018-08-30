import assert from 'assert';
import neatequal from 'neatequal';
import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet,
} from './utils';

describe('utils', () => {
  describe('parseHTTPHeadersQuotedKeyValueSet', () => {
    it('should work with good datas', () => {
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

    it('should fail with bad quoted value pair', () => {
      assert.throws(
        () => parseHTTPHeadersQuotedKeyValueSet('realm'),
        /E_MALFORMED_QUOTEDKEYVALUE/,
      );
    });

    it('should fail with bad quoted value pair', () => {
      assert.throws(
        () => parseHTTPHeadersQuotedKeyValueSet('realm="dsad"', []),
        /E_UNAUTHORIZED_KEY/,
      );
    });

    it('should fail with bad quoted value pair', () => {
      assert.throws(
        () => parseHTTPHeadersQuotedKeyValueSet('realm=dsad', ['realm']),
        /E_UNQUOTED_VALUE/,
      );
    });
  });

  describe('buildHTTPHeadersQuotedKeyValueSet', () => {
    it('should work with good datas', () => {
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

    it('should work with unused keys', () => {
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

    it('should fail without required keys', () => {
      assert.throws(() =>
        buildHTTPHeadersQuotedKeyValueSet(
          {
            realm: 'testrealm@host.com',
            qop: 'auth, auth-int',
          },
          ['realm', 'qop', 'nonce'],
          ['realm', 'qop', 'nonce'],
          'realm="testrealm@host.com", ' +
            'qop="auth, auth-int", ' +
            'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093"',
          /E_UNQUOTED_VALUE/,
        ),
      );
    });
  });
});
