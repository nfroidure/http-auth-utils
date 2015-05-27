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
    let [username, password] = ((new Buffer(rest, 'base64')).toString()).split(':');
    return {
      username,
      password
    };
  },
  buildAuthorizationRest: function buildAuthorizationRest(data) {
    return BASIC.computeHash(data);
  },
  computeHash: function computeHash({username, password}) {
    return (new Buffer(username + ':' + password)).toString('base64');
  }
};

export default BASIC;
