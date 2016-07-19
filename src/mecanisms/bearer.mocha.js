import assert from 'assert';
import neatequal from 'neatequal';
import BEARER from './bearer';

describe('BEARER', function() {

  describe('type', function() {

    it('should be the basic auth prefix', function() {
      assert.equal(BEARER.type, 'Bearer');
    });

  });

  describe('parseWWWAuthenticateRest', function() {

    it('should work', function() {
      neatequal(
        BEARER.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
          realm: 'perlinpinpin',
        }
      );
    });

  });

  describe('buildWWWAuthenticateRest', function() {

    it('should work', function() {
      assert.equal(
        BEARER.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
        }),
        'realm="perlinpinpin"'
      );
    });

    it('should be the inverse of parseWWWAuthenticateRest', function() {
      neatequal(
        BEARER.parseWWWAuthenticateRest(
          BEARER.buildWWWAuthenticateRest({
            realm: 'perlinpinpin',
          })
        ), {
          realm: 'perlinpinpin',
        }
      );
    });

  });

  describe('parseAuthorizationRest', function() {

    it('should work', function() {
      neatequal(
        BEARER.parseAuthorizationRest('mF_9.B5f-4.1JqM'), {
          hash: 'mF_9.B5f-4.1JqM',
        }
      );
    });

  });

  describe('buildAuthorizationRest', function() {

    it('should work', function() {
      assert.equal(
        BEARER.buildAuthorizationRest({
          hash: 'mF_9.B5f-4.1JqM',
        }),
        'mF_9.B5f-4.1JqM'
      );
    });

    it('should be the inverse of parseAuthorizationRest', function() {
      neatequal(
        BEARER.parseAuthorizationRest(
          BEARER.buildAuthorizationRest({
            hash: 'mF_9.B5f-4.1JqM',
          })
        ), {
          hash: 'mF_9.B5f-4.1JqM',
        }
      );
    });

  });

});
