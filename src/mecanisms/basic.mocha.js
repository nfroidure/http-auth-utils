import assert from 'assert';
import neatequal from 'neatequal';
import BASIC from './basic';

describe('BASIC', function() {

  describe('type', function() {

    it('should be the basic auth prefix', function() {
      assert.equal(BASIC.type, 'Basic');
    });

  });

  describe('parseWWWAuthenticateRest', function() {

    it('should work', function() {
      neatequal(
        BASIC.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
          realm: 'perlinpinpin'
        }
      );
    });

  });

  describe('buildWWWAuthenticateRest', function() {

    it('should work', function() {
      assert.equal(
        BASIC.buildWWWAuthenticateRest({
          realm: 'perlinpinpin'
        }),
        'realm="perlinpinpin"'
      );
    });

    it('should be the inverse of parseWWWAuthenticateRest', function() {
      neatequal(
        BASIC.parseWWWAuthenticateRest(
          BASIC.buildWWWAuthenticateRest({
            realm: 'perlinpinpin'
          })
        ), {
        realm: 'perlinpinpin'
      });
    });

  });

  describe('parseAuthorizationRest', function() {

    it('should work', function() {
      neatequal(
        BASIC.parseAuthorizationRest('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          username: 'Ali Baba',
          password: 'open sesame'
        }
      );
    });

  });

  describe('buildAuthorizationRest', function() {

    it('should work with credentials', function() {
      assert.equal(
        BASIC.buildAuthorizationRest({
          username: 'Ali Baba',
          password: 'open sesame'
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
      );
    });

    it('should work with just the hash', function() {
      assert.equal(
        BASIC.buildAuthorizationRest({
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
      );
    });

    it('should be the inverse of parseAuthorizationRest', function() {
      neatequal(
        BASIC.parseAuthorizationRest(
          BASIC.buildAuthorizationRest({
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          username: 'Ali Baba',
          password: 'open sesame'
          })
        ), {
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          username: 'Ali Baba',
          password: 'open sesame'
      });
    });

  });

  describe('computeHash', function() {

      it('should work', function() {
        assert.equal(
          BASIC.computeHash({
            username: 'Ali Baba',
            password: 'open sesame'
          }),
          'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
        );
      });

  });

  describe('decodeHash', function() {

      it('should work', function() {
        neatequal(
          BASIC.decodeHash('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
            username: 'Ali Baba',
            password: 'open sesame'
          }
        );
      });

  });

});
