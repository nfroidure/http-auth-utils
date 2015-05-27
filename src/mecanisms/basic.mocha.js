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
        BASIC.parseAuthorizationRest('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
          hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
        }
      );
    });

  });

  describe('buildAuthorizationRest', function() {

    it('should work', function() {
      assert.equal(
        BASIC.buildAuthorizationRest({
          hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
        }),
        'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
      );
    });

    it('should be the inverse of parseAuthorizationRest', function() {
      neatequal(
        BASIC.parseAuthorizationRest(
          BASIC.buildAuthorizationRest({
          hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
          })
        ), {
          hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
      });
    });

  });

  describe('computeHash', function() {

      it('should work', function() {
        assert.equal(
          BASIC.computeHash({
            username: 'Aladdin',
            password: 'open sesame'
          }),
          'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
        );
      });

  });

  describe('decodeHash', function() {

      it('should work', function() {
        neatequal(
          BASIC.decodeHash('QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
            username: 'Aladdin',
            password: 'open sesame'
          }
        );
      });

  });

});
