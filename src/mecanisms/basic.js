import {
  parseHTTPHeadersQuotedKeyValueSet,
  buildHTTPHeadersQuotedKeyValueSet
} from '../utils';

// BASIC
// http://tools.ietf.org/html/rfc2617#section-2

const AUTHORIZED_WWW_AUTHENTICATE_KEYS = ['realm'];

const BASIC = {
  type: 'Basic',
  parseWWWAuthenticateRest: function parseWWWAuthenticateRest(rest) {
    return parseHTTPHeadersQuotedKeyValueSet(rest, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },
  buildWWWAuthenticateRest: function buildWWWAuthenticateRest(data) {
    return buildHTTPHeadersQuotedKeyValueSet(data, AUTHORIZED_WWW_AUTHENTICATE_KEYS, []);
  },
  parseAuthorizationRest: function parseAuthorizationRest(rest) {
    if(!rest) {
      throw new YError('E_EMPTY_AUTH');
    }
    return {
      hash: rest
    };
  },
  buildAuthorizationRest: function buildAuthorizationRest({hash}) {
    return hash;
  },
  computeHash: function computeHash({username, password}) {
    return (new Buffer(username + ':' + password)).toString('base64');
  },
  decodeHash: function decodeHash(hash) {
    let [username, password] = ((new Buffer(hash, 'base64')).toString()).split(':');
    return {
      username,
      password
    };
  }
};

export default BASIC;
