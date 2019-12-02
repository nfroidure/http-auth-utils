import assert from 'assert';
import neatequal from 'neatequal';
import {
  parseWWWAuthenticateHeader,
  parseAuthorizationHeader,
  buildWWWAuthenticateHeader,
  buildAuthorizationHeader,
  mechanisms,
  BASIC,
  DIGEST,
  BEARER,
} from './index';

describe('index', () => {
  describe('parseWWWAuthenticateHeader', () => {
    it('should parse Basic headers', () => {
      neatequal(parseWWWAuthenticateHeader('Basic realm="test"'), {
        type: 'Basic',
        data: {
          realm: 'test',
        },
      });
      neatequal(
        parseWWWAuthenticateHeader('basic realm="test"', [BASIC], {
          strict: false,
        }),
        {
          type: 'Basic',
          data: {
            realm: 'test',
          },
        },
      );
    });
    it('should parse Bearer headers', () => {
      neatequal(parseWWWAuthenticateHeader('Bearer realm="test"', mechanisms), {
        type: 'Bearer',
        data: {
          realm: 'test',
        },
      });
      neatequal(
        parseWWWAuthenticateHeader('bearer realm="test"', mechanisms, {
          strict: false,
        }),
        {
          type: 'Bearer',
          data: {
            realm: 'test',
          },
        },
      );
    });

    it('should fail with unknown headers', () => {
      assert.throws(
        () => parseWWWAuthenticateHeader('Kikoolol realm="test"'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });
  });

  describe('parseAuthorizationHeader', () => {
    it('should parse Basic headers', () => {
      neatequal(
        parseAuthorizationHeader('Basic QWxpIEJhYmE6b3BlbiBzZXNhbWU='),
        {
          type: 'Basic',
          data: {
            username: 'Ali Baba',
            password: 'open sesame',
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          },
        },
      );
      neatequal(
        parseAuthorizationHeader(
          'basic QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          [BASIC],
          {
            strict: false,
          },
        ),
        {
          type: 'Basic',
          data: {
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
            username: 'Ali Baba',
            password: 'open sesame',
          },
        },
        { strict: false },
      );
      neatequal(
        parseAuthorizationHeader(
          'Basic QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          mechanisms,
        ),
        {
          type: 'Basic',
          data: {
            username: 'Ali Baba',
            password: 'open sesame',
            hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          },
        },
      );
      neatequal(
        parseAuthorizationHeader(
          'Basic bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        ),
        {
          type: 'Basic',
          data: {
            username: 'nicolas.froidure@simplifield.com',
            password: 'test',
            hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
          },
        },
      );
    });

    it('should parse Basic headers with a ":" char in the password', () => {
      neatequal(parseAuthorizationHeader('Basic Sm9objpSOlU6a2lkZGluZz8='), {
        type: 'Basic',
        data: {
          username: 'John',
          password: 'R:U:kidding?',
          hash: 'Sm9objpSOlU6a2lkZGluZz8=',
        },
      });
    });

    it('should fail with unknown headers', () => {
      assert.throws(
        () => parseAuthorizationHeader('Kikoolol ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });

    it('should fail with basic headers in strict mode', () => {
      assert.throws(
        () => parseAuthorizationHeader('basic ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
      assert.throws(
        () => parseAuthorizationHeader('basic ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
        {},
      );
      assert.throws(
        () => parseAuthorizationHeader('basic ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
        { strict: true },
      );
    });
  });

  describe('buildWWWAuthenticateHeader', () => {
    it('should build Basic headers', () => {
      assert.equal(
        buildWWWAuthenticateHeader(BASIC, {
          realm: 'test',
        }),
        'Basic realm="test"',
      );
    });

    it('should be reentrant', () => {
      assert.equal(
        buildWWWAuthenticateHeader(
          BASIC,
          parseWWWAuthenticateHeader('Basic realm="test"').data,
        ),
        'Basic realm="test"',
      );
    });
  });

  describe('buildAuthorizationHeader', () => {
    it('should build Basic headers', () => {
      assert.equal(
        buildAuthorizationHeader(BASIC, {
          username: 'John',
          password: 'R:U:kidding?',
        }),
        'Basic Sm9objpSOlU6a2lkZGluZz8=',
      );
    });

    it('should be reentrant', () => {
      assert.equal(
        buildAuthorizationHeader(
          BASIC,
          parseAuthorizationHeader('Basic Sm9objpSOlU6a2lkZGluZz8=').data,
        ),
        'Basic Sm9objpSOlU6a2lkZGluZz8=',
      );
    });
  });

  describe('mechanisms', () => {
    it('should export bot DIGEST and BASIC  mechanisms', () => {
      assert.equal(mechanisms.length, 3);
    });

    it('should export DIGEST BASIC and BEARER mechanisms', () => {
      assert(BASIC);
      assert(DIGEST);
      assert(BEARER);
    });
  });
});
