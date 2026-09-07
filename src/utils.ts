import { YError } from 'yerror';

const QUOTE = '"';
const EQUAL = '=';
const SEPARATOR = ', ';
const TOKEN_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

/*
 * Regular expression for matching the key-value pairs
 * \w+     = The key
 * =       = The equal sign
 * ".*?"   = Value option 1: A double-quoted value (using the non-greedy *? to stop at the first doublequote)
 * [^",]+  = Value option 2: A string without commas or double-quotes
 * (?=,|$) = Zero-width (as in not captured) positive lookahead assertion.
 *           The previous match will only be valid if it's followed by a " literal
 *           or the end of the string
 */
const KEYVALUE_REGEXP = /\w+=(".*?"|[^",]+)(?=,|$)/g;

// FIXME: Create a real parser
export function parseHTTPHeadersQuotedKeyValueSet(
  contents: string,
  authorizedKeys: string[],
  requiredKeys: string[] = [],
  allowedValues: AllowedValues = {},
): Record<string, string> {
  const matches = contents.trim().match(KEYVALUE_REGEXP);

  if (!matches) throw new YError('E_MALFORMED_QUOTEDKEYVALUE', [contents]);

  const data = matches
    .map((part, partPosition) => {
      const [key, ...rest] = part.split(EQUAL);
      const value = rest.join(EQUAL);
      if (0 === rest.length) {
        throw new YError('E_MALFORMED_QUOTEDKEYVALUE', [partPosition, part]);
      }
      return [key, value];
    })
    .reduce(
      function (parsedValues, [name, value], valuePosition) {
        const normalizedName = name.toLowerCase();
        if (-1 === authorizedKeys.indexOf(normalizedName)) {
          throw new YError('E_UNAUTHORIZED_KEY', [
            valuePosition,
            normalizedName,
          ]);
        }

        /*
         * Regular expression for stripping paired starting and ending double quotes off the value:
         * ^      = The beginning of the string
         * "      = The first double quote
         * .*     = Characters of any kind
         * (?="$) = Zero-width (as in not captured) positive lookahead assertion.
         *          The previous match will only be valid if it's followed by a " literal
         *          or the end of the string
         * "      = The ending double quote
         * $      = The end of the string
         */ parsedValues[normalizedName] = value.replace(
          /^"(.*(?="$))"$/,
          '$1',
        );

        return parsedValues;
      },
      {} as Record<string, string>,
    );

  _checkRequiredKeys(requiredKeys, data);

  return _normalizeAllowedValues(allowedValues, data);
}

export function buildHTTPHeadersQuotedKeyValueSet(
  data: Record<string, string>,
  authorizedKeys: string[],
  requiredKeys: string[] = [],
  unquotedKeys: string[] = [],
  allowedValues: AllowedValues = {},
): string {
  _checkRequiredKeys(requiredKeys, data);
  data = _normalizeAllowedValues(allowedValues, data);
  return authorizedKeys.reduce(function (contents, key) {
    if (data[key] !== undefined) {
      const unquoted = unquotedKeys.includes(key);

      if (unquoted && !TOKEN_REGEXP.test(data[key])) {
        throw new YError('E_MALFORMED_TOKEN', [key, data[key]]);
      }

      const quote = unquoted ? '' : QUOTE;

      return (
        contents +
        (contents ? SEPARATOR : '') +
        key +
        EQUAL +
        quote +
        data[key] +
        quote
      );
    }
    return contents;
  }, '');
}

function _checkRequiredKeys(
  requiredKeys: string[],
  data: Record<string, string>,
): void {
  requiredKeys.forEach((name) => {
    if ('undefined' === typeof data[name]) {
      throw new YError('E_REQUIRED_KEY', [name]);
    }
  });
}

export type AllowedValues = Record<
  string,
  | {
      values?: string[];
      caseInsensitive?: boolean;
    }
  | {
      regExp?: RegExp;
    }
>;

function _normalizeAllowedValues(
  allowedValues: AllowedValues,
  data: Record<string, string>,
): Record<string, string> {
  const keys = Object.keys(allowedValues);

  if (!keys.length) {
    return data;
  }

  data = { ...data };

  for (const key of keys) {
    if (typeof data[key] !== 'undefined') {
      if ('values' in allowedValues[key] && allowedValues[key].values) {
        const index = (
          allowedValues[key].caseInsensitive
            ? allowedValues[key].values.map((s) => s.toUpperCase())
            : allowedValues[key].values
        ).indexOf(
          allowedValues[key].caseInsensitive
            ? data[key].toUpperCase()
            : data[key],
        );

        if (index === -1) {
          throw new YError('E_UNSUPPORTED_VALUE', [
            key,
            data[key],
            allowedValues[key].values,
          ]);
        }

        data[key] = allowedValues[key].values[index];
      } else if ('regExp' in allowedValues[key] && allowedValues[key].regExp) {
        if (!data[key].match(allowedValues[key].regExp)) {
          throw new YError('E_INVALID_VALUE', [
            key,
            data[key],
            allowedValues[key].regExp.toString(),
          ]);
        }
      }
    }
  }

  return data;
}
