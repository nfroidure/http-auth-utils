import BASIC from './mecanisms/basic';
import DIGEST from './mecanisms/basic';

export const parseWWWAuthenticateHeader =
  function parseWWWAuthenticateHeader(header, authMecanisms = [BASIC, DIGEST]) {
    let result = null;
    authMecanisms.some(function(authMecanism) {
      if(header.startsWith(authMecanism.type + ' ')) {
        result = {
          type: authMecanism.type,
          data: authMecanism.parseWWWAuthenticateRest(
            header.substr(authMecanism.type.length + 1)
          )
        };
      }
    });
    if(result) {
      return result;
    }
    throw new YError('E_UNKNOWN_AUTH_MECANISM', header);
  };

export const parseAuthorizationHeader =
  function parseAuthorizationHeader(header, authMecanisms = [BASIC, DIGEST]) {
    let result = null;
    authMecanisms.some(function(authMecanism) {
      if(header.startsWith(authMecanism.type + ' ')) {
        result = {
          type: authMecanism.type,
          data: authMecanism.parseAuthorizationRest(
            header.substr(authMecanism.type.length + 1)
          )
        };
      }
    });
    if(result) {
      return result;
    }
    throw new YError('E_UNKNOWN_AUTH_MECANISM', header);
  };
