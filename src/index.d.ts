type Mechanism = {
  type: string;
};

declare const BASIC: Mechanism;
declare const DIGEST: Mechanism;
declare const BEARER: Mechanism;
declare const mechanisms: Array<Mechanism>;

declare function parseAuthorizationHeader(
  header: string,
  authMechanisms?: Array<Mechanism>,
): {
  type: string;
  data: {
    [prop: string]: any;
  };
};
declare function parseWWWAuthenticateHeader(
  header: string,
  authMechanisms?: Array<Mechanism>,
): {
  type: string;
  data: {
    [prop: string]: any;
  };
};
declare function buildWWWAuthenticateHeader(
  authMechanism: Mechanism,
  data: {
    [prop: string]: any;
  },
): string;
declare function buildAuthorizationHeader(
  authMechanism: Mechanism,
  data: {
    [prop: string]: any;
  },
): string;

export {
  parseWWWAuthenticateHeader,
  parseAuthorizationHeader,
  buildWWWAuthenticateHeader,
  buildAuthorizationHeader,
  BASIC,
  DIGEST,
  BEARER,
  mechanisms,
};
