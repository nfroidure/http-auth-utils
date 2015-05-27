import assert from 'assert';
import neatequal from 'neatequal';
import {
  parseWWWAuthenticateHeader,
  parseAuthorizationHeader
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
        parseAuthorizationHeader('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='), {
          type: 'Basic',
          data: {
            hash: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
          }
        }
      );
    });

  });

});
