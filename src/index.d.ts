type Mechanism = {
  type: string;
};

declare const BASIC : Mechanism;
declare const DIGEST : Mechanism;
declare const BEARER : Mechanism; 
declare const mechanisms : Array<Mechanism>;

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

export {
  parseWWWAuthenticateHeader,
  parseAuthorizationHeader,
  BASIC,
  DIGEST,
  BEARER,
  mechanisms,
};
