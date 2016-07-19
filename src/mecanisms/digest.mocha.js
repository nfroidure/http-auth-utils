import assert from 'assert';
import neatequal from 'neatequal';
import DIGEST from './digest';

describe('digest', () => {

  describe('type', () => {

    it('should be the digest auth prefix', () => {
      assert.equal(DIGEST.type, 'Digest');
    });

  });

  describe('parseWWWAuthenticateRest', () => {

    it('should work', () => {
      neatequal(
        DIGEST.parseWWWAuthenticateRest(
          'realm="testrealm@host.com", ' +
          'qop="auth, auth-int", ' +
          'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
          'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
        ), {
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        }
      );
    });

  });

  describe('buildWWWAuthenticateRest', () => {

    it('should work', () => {
      assert.equal(
        DIGEST.buildWWWAuthenticateRest({
          realm: 'testrealm@host.com',
          qop: 'auth, auth-int',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        }),
        'realm="testrealm@host.com", ' +
        'qop="auth, auth-int", ' +
        'nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093", ' +
        'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
      );
    });

    it('should be the inverse of parseWWWAuthenticateRest', () => {
      neatequal(
        DIGEST.parseWWWAuthenticateRest(
          DIGEST.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
          })
        ), {
          realm: 'perlinpinpin',
        }
      );
    });

  });

  describe('parseAuthorizationRest', () => {

    it('should work', () => {
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
          'opaque="5ccc069c403ebaf9f0171e9517f40e41"'
        ), {
          username: 'Mufasa',
          realm: 'testrealm@host.com',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          uri: '/dir/index.html',
          qop: 'auth',
          nc: '00000001',
          cnonce: '0a4f113b',
          response: '6629fae49393a05397450978507c4ef1',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        }
      );
    });

  });

  describe('buildAuthorizationRest', () => {

    it('should work', () => {
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
        'nc="00000001"'
      );
    });

    it('should be the inverse of parseAuthorizationRest', () => {
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
          })
        ), {
          username: 'Mufasa',
          realm: 'testrealm@host.com',
          nonce: 'dcd98b7102dd2f0e8b11d0f600bfb0c093',
          uri: '/dir/index.html',
          qop: 'auth',
          nc: '00000001',
          cnonce: '0a4f113b',
          response: '6629fae49393a05397450978507c4ef1',
          opaque: '5ccc069c403ebaf9f0171e9517f40e41',
        }
      );
    });

  });

  describe('computeHash', () => {

    it('should work', () => {
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
        '6629fae49393a05397450978507c4ef1'
      );
    });

  });

});
