declare module 'yerror' {
  interface YErrorRegistry {
    /** Thrown when an unknown authentication mechanism is specified in the Authorization header */
    E_UNKNOWN_AUTH_MECHANISM: [header: string];

    /** Thrown when the Authorization header is present but empty */
    E_EMPTY_AUTH: [];

    /** Thrown when a required hash is missing in digest authentication */
    E_NO_HASH: [];

    /** Thrown when an invalid error code is provided */
    E_INVALID_ERROR: [error: string, authorizedErrorCodes: string[]];

    /** Thrown when parsing a quoted key-value pair fails */
    E_MALFORMED_QUOTEDKEYVALUE:
      | [contents: string]
      | [partPosition: number, part: string];

    /** Thrown when an unauthorized key is encountered during parsing */
    E_UNAUTHORIZED_KEY: [valuePosition: number, normalizedName: string];

    /** Thrown when a required key is missing from the authentication data */
    E_REQUIRED_KEY: [name: string];
  }
}
