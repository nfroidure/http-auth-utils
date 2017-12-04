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
        ),
        {
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        },
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
            opaque: '5ccc069c403ebaf9f0171e9517f40e41',
          },
          ['realm', 'qop', 'nonce', 'opaque'],
        ),
        'realm="testrealm@host.com", ' +
          'qop="auth, auth-int", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41"',
      );
    });
  });
});
