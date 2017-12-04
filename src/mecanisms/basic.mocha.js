import assert from 'assert';
import neatequal from 'neatequal';
import BASIC from './basic';

describe('BASIC', () => {
  describe('type', () => {
    it('should be the basic auth prefix', () => {
      assert.equal(BASIC.type, 'Basic');
    });
  });

  describe('parseWWWAuthenticateRest', () => {
    it('should work', () => {
      neatequal(BASIC.parseWWWAuthenticateRest('realm="perlinpinpin"'), {
        realm: 'perlinpinpin',
      });
    });
  });

  describe('buildWWWAuthenticateRest', () => {
    it('should work', () => {
      assert.equal(
        BASIC.buildWWWAuthenticateRest({
          realm: 'perlinpinpin',
        }),
        'realm="perlinpinpin"',
      );
    });

    it('should be the inverse of parseWWWAuthenticateRest', () => {
      neatequal(
        BASIC.parseWWWAuthenticateRest(
          BASIC.buildWWWAuthenticateRest({
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
      neatequal(BASIC.parseAuthorizationRest('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
        hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        username: 'Ali Baba',
        password: 'open sesame',
      });
      neatequal(
        BASIC.parseAuthorizationRest(
          'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        ),
        {
          hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
          username: 'nicolas.froidure@simplifield.com',
          password: 'test',
        },
      );
    });
  });

  describe('buildAuthorizationRest', () => {
    it('should work with credentials', () => {
      assert.equal(
        BASIC.buildAuthorizationRest({
          username: 'Ali Baba',
          password: 'open sesame',
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
      );
    });

    it('should work with just the hash', () => {
      assert.equal(
        BASIC.buildAuthorizationRest({
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
      );
    });

    it('should be the inverse of parseAuthorizationRest', () => {
      neatequal(
        BASIC.parseAuthorizationRest(
          BASIC.buildAuthorizationRest({
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
            username: 'Ali Baba',
            password: 'open sesame',
          }),
        ),
        {
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          username: 'Ali Baba',
          password: 'open sesame',
        },
      );
    });
  });

  describe('computeHash', () => {
    it('should work', () => {
      assert.equal(
        BASIC.computeHash({
          username: 'Ali Baba',
          password: 'open sesame',
        }),
        'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
      );
    });
  });

  describe('decodeHash', () => {
    it('should work', () => {
      neatequal(BASIC.decodeHash('QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
        username: 'Ali Baba',
        password: 'open sesame',
      });
    });
  });
});
