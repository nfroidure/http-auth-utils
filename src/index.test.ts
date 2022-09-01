import { describe, test } from '@jest/globals';
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
} from './index.js';

describe('index', () => {
  describe('parseWWWAuthenticateHeader', () => {
    test('should parse Basic headers', () => {
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
    test('should parse Bearer headers', () => {
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

    test('should fail with unknown headers', () => {
      assert.throws(
        () => parseWWWAuthenticateHeader('Kikoolol realm="test"'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });
  });

  describe('parseAuthorizationHeader', () => {
    test('should parse Basic headers', () => {
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

    test('should parse Basic headers with a ":" char in the password', () => {
      neatequal(parseAuthorizationHeader('Basic Sm9objpSOlU6a2lkZGluZz8='), {
        type: 'Basic',
        data: {
          username: 'John',
          password: 'R:U:kidding?',
          hash: 'Sm9objpSOlU6a2lkZGluZz8=',
        },
      });
    });

    test('should fail with unknown headers', () => {
      assert.throws(
        () => parseAuthorizationHeader('Kikoolol ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });

    test('should fail with basic headers in strict mode', () => {
      assert.throws(
        () => parseAuthorizationHeader('basic ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
      assert.throws(
        () => parseAuthorizationHeader('basic ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
      assert.throws(
        () => parseAuthorizationHeader('basic ddd'),
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });
  });

  describe('buildWWWAuthenticateHeader', () => {
    test('should build Basic headers', () => {
      assert.equal(
        buildWWWAuthenticateHeader(BASIC, {
          realm: 'test',
        }),
        'Basic realm="test"',
      );
    });

    test('should be reentrant', () => {
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
    test('should build Basic headers', () => {
      assert.equal(
        buildAuthorizationHeader(BASIC, {
          username: 'John',
          password: 'R:U:kidding?',
        }),
        'Basic Sm9objpSOlU6a2lkZGluZz8=',
      );
    });

    test('should be reentrant', () => {
      assert.equal(
        buildAuthorizationHeader(
          BASIC,
          parseAuthorizationHeader('Basic Sm9objpSOlU6a2lkZGluZz8=', [BASIC])
            .data,
        ),
        'Basic Sm9objpSOlU6a2lkZGluZz8=',
      );
    });
  });

  describe('mechanisms', () => {
    test('should export bot DIGEST and BASIC  mechanisms', () => {
      assert.equal(mechanisms.length, 3);
    });

    test('should export DIGEST BASIC and BEARER mechanisms', () => {
      assert(BASIC);
      assert(DIGEST);
      assert(BEARER);
    });
  });
});
