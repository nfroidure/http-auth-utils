import assert from 'assert';
import neatequal from 'neatequal';
import BEARER from './bearer';

describe('BEARER', () => {
  describe('type', () => {
    it('should be the basic auth prefix', () => {
      assert.equal(BEARER.type, 'Bearer');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    it('should work', () => {
      neatequal(BEARER.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
        realm: 'perlinpinpin',
      });
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    it('should work', () => {
      assert.equal(
        BEARER.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
        }),
        'realm="perlinpinpin"',
      );
    });

    it('should be the inverse of parseWWWAuthenticateRest', () => {
      neatequal(
        BEARER.parseWWWAuthenticateRest(
          BEARER.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
          }),
        ),
        {
          realm: 'perlinpinpin',
        },
      );
    });
  });

  describe('parseAuthorizationRest', () => {
    it('should work', () => {
      neatequal(BEARER.parseAuthorizationRest('mF_9.B5f-4.1JqM'), {
        hash: 'mF_9.B5f-4.1JqM',
      });
    });
  });

  describe('buildAuthorizationRest', () => {
    it('should work', () => {
      assert.equal(
        BEARER.buildAuthorizationRest({
          hash: 'mF_9.B5f-4.1JqM',
        }),
        'mF_9.B5f-4.1JqM',
      );
    });

    it('should be the inverse of parseAuthorizationRest', () => {
      neatequal(
        BEARER.parseAuthorizationRest(
          BEARER.buildAuthorizationRest({
            hash: 'mF_9.B5f-4.1JqM',
          }),
        ),
        {
          hash: 'mF_9.B5f-4.1JqM',
        },
      );
    });
  });
});
