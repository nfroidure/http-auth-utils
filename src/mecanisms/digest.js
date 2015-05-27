import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet
} from '../utils';
import crypto from 'crypto';

// DIGEST
// http://tools.ietf.org/html/rfc2617#section-3
// http://tools.ietf.org/html/rfc2069#section-2
const AUTHORIZED_WWW_AUTHENTICATE_KEYS = [
  'realm', 'domain', 'qop', 'nonce', 'opaque', 'stale', 'algorithm'
];
const AUTHORIZED_AUTHORIZATION_KEYS = [
  'username', 'realm', 'nonce', 'uri', 'response', 'algorithm', 'cnonce',
  'opaque', 'qop', 'nc'
];

const DIGEST = {
  type: 'Digest',
  parseWWWAuthenticateRest: function parseWWWAuthenticateRest(rest) {
    return parseHTTPHeadersQuotedKeyValueSet(rest, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },
  buildWWWAuthenticateRest: function buildWWWAuthenticateRest(data) {
    return buildHTTPHeadersQuotedKeyValueSet(data, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },
  parseAuthorizationRest: function parseAuthorizationRest(rest) {
    return parseHTTPHeadersQuotedKeyValueSet(rest, AUTHORIZED_AUTHORIZATION_KEYS, []);
  },
  buildAuthorizationRest: function buildAuthorizationRest(data) {
    return buildHTTPHeadersQuotedKeyValueSet(data, AUTHORIZED_AUTHORIZATION_KEYS, []);
  },
  computeHash: function computeHash(data) {
    let ha1 = data.ha1 || _computeHash(data.algorithm, [
      data.username, data.realm, data.password
    ].join(':'));
    let ha2 = _computeHash(data.algorithm, [
      data.method, data.uri
    ].join(':'));
    return _computeHash(data.algorithm, [
      ha1, data.nonce, data.nc, data.cnonce, data.qop, ha2
    ].join(':'));
  }
};

function _computeHash(algorithm, str) {
  let hashsum = crypto.createHash(algorithm);
  hashsum.update(str);
  return hashsum.digest('hex');
}

export default DIGEST;
