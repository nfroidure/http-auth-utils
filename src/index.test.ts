import { describe, test, expect } from '@jest/globals';
import {
  parseWWWAuthenticateHeader,
  parseAuthorizationHeader,
  buildWWWAuthenticateHeader,
  buildAuthorizationHeader,
  mechanisms,
  BASIC,
  DIGEST,
  BEARER,
  Mechanism,
} from './index.js';

describe('index', () => {
  describe('parseWWWAuthenticateHeader', () => {
    test('should parse Basic headers', () => {
      expect(parseWWWAuthenticateHeader('Basic realm="test"')).toEqual({
        type: 'Basic',
        data: {
          realm: 'test',
        },
      });
      expect(
        parseWWWAuthenticateHeader(
          'basic realm="test"',
          [BASIC] as unknown as Mechanism[],
          {
            strict: false,
          },
        ),
      ).toEqual({
        type: 'Basic',
        data: {
          realm: 'test',
        },
      });
    });
    test('should parse Bearer headers', () => {
      expect(
        parseWWWAuthenticateHeader('Bearer realm="test"', mechanisms),
      ).toEqual({
        type: 'Bearer',
        data: {
          realm: 'test',
        },
      });
      expect(
        parseWWWAuthenticateHeader('bearer realm="test"', mechanisms, {
          strict: false,
        }),
      ).toEqual({
        type: 'Bearer',
        data: {
          realm: 'test',
        },
      });
    });

    test('should fail with unknown headers', () => {
      expect(() => parseWWWAuthenticateHeader('Kikoolol realm="test"')).toThrow(
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });
  });

  describe('parseAuthorizationHeader', () => {
    test('should parse Basic headers', () => {
      expect(
        parseAuthorizationHeader('Basic QWxpIEJhYmE6b3BlbiBzZXNhbWU='),
      ).toEqual({
        type: 'Basic',
        data: {
          username: 'Ali Baba',
          password: 'open sesame',
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        },
      });
      expect(
        parseAuthorizationHeader(
          'basic QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          [BASIC] as unknown as Mechanism[],
          {
            strict: false,
          },
        ),
      ).toEqual({
        type: 'Basic',
        data: {
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          username: 'Ali Baba',
          password: 'open sesame',
        },
      });
      expect(
        parseAuthorizationHeader(
          'Basic QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
          mechanisms,
        ),
      ).toEqual({
        type: 'Basic',
        data: {
          username: 'Ali Baba',
          password: 'open sesame',
          hash: 'QWxpIEJhYmE6b3BlbiBzZXNhbWU=',
        },
      });
      expect(
        parseAuthorizationHeader(
          'Basic bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        ),
      ).toEqual({
        type: 'Basic',
        data: {
          username: 'nicolas.froidure@simplifield.com',
          password: 'test',
          hash: 'bmljb2xhcy5mcm9pZHVyZUBzaW1wbGlmaWVsZC5jb206dGVzdA==',
        },
      });
    });

    test('should parse Basic headers with a ":" char in the password', () => {
      expect(
        parseAuthorizationHeader('Basic Sm9objpSOlU6a2lkZGluZz8='),
      ).toEqual({
        type: 'Basic',
        data: {
          username: 'John',
          password: 'R:U:kidding?',
          hash: 'Sm9objpSOlU6a2lkZGluZz8=',
        },
      });
    });

    test('should fail with unknown headers', () => {
      expect(() => parseAuthorizationHeader('Kikoolol ddd')).toThrow(
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });

    test('should fail with basic headers in strict mode', () => {
      expect(() => parseAuthorizationHeader('basic ddd')).toThrow(
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
      expect(() => parseAuthorizationHeader('basic ddd')).toThrow(
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
      expect(() => parseAuthorizationHeader('basic ddd')).toThrow(
        /E_UNKNOWN_AUTH_MECHANISM/,
      );
    });
  });

  describe('buildWWWAuthenticateHeader', () => {
    test('should build Basic headers', () => {
      expect(
        buildWWWAuthenticateHeader(BASIC as unknown as Mechanism, {
          realm: 'test',
        }),
      ).toEqual('Basic realm="test"');
    });

    test('should be reentrant', () => {
      expect(
        buildWWWAuthenticateHeader(
          BASIC as unknown as Mechanism,
          parseWWWAuthenticateHeader('Basic realm="test"').data,
        ),
      ).toEqual('Basic realm="test"');
    });
  });

  describe('buildAuthorizationHeader', () => {
    test('should build Basic headers', () => {
      expect(
        buildAuthorizationHeader(BASIC as unknown as Mechanism, {
          username: 'John',
          password: 'R:U:kidding?',
        }),
      ).toEqual('Basic Sm9objpSOlU6a2lkZGluZz8=');
    });

    test('should be reentrant', () => {
      expect(
        buildAuthorizationHeader(
          BASIC as unknown as Mechanism,
          parseAuthorizationHeader('Basic Sm9objpSOlU6a2lkZGluZz8=', [
            BASIC,
          ] as unknown as Mechanism[]).data,
        ),
      ).toEqual('Basic Sm9objpSOlU6a2lkZGluZz8=');
    });
  });

  describe('mechanisms', () => {
    test('should export bot DIGEST and BASIC  mechanisms', () => {
      expect(mechanisms.length).toEqual(3);
    });

    test('should export DIGEST BASIC and BEARER mechanisms', () => {
      expect(BASIC).toBeDefined();
      expect(DIGEST).toBeDefined();
      expect(BEARER).toBeDefined();
    });
  });
});
