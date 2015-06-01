import assert from 'assert';
import neatequal from 'neatequal';
import {
  parseWWWAuthenticateHeader,
  parseAuthorizationHeader,
  mecanisms,
  BASIC,
  DIGEST
} from './index';

describe('index', function() {

  describe('parseWWWAuthenticateHeader', function() {

    it('should parse Basic headers', function() {
      neatequal(
        parseWWWAuthenticateHeader('Basic realm="test"'), {
          type: 'Basic',
          data: {
            realm: 'test'
          }
        }
      );
    });

  });

  describe('parseAuthorizationHeader', function() {

    it('should parse Basic headers', function() {
      neatequal(
        parseAuthorizationHeader('Basic QWxpIEJhYmE6b3BlbiBzZXNhbWU='), {
          type: 'Basic',
          data: {
          username: 'Ali Baba',
          password: 'open sesame',
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU='
          }
        }
      );
    });

  });

  describe('mecanisms', function() {

    it('should export bot DIGEST and BASIC  mecanisms', function() {
      assert.equal(
        mecanisms.length,
        2
      );
    });

    it('should export bot DIGEST and BASIC  mecanisms', function() {
      assert(BASIC);
      assert(DIGEST);
    });

  });

});
