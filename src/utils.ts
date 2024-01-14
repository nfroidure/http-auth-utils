import { YError } from 'yerror';

const QUOTE = '"';
const EQUAL = '=';
const SEPARATOR = ', ';

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
  valuesToNormalize: string[] = [],
): Record<string, string> {
  const matches = contents.trim().match(KEYVALUE_REGEXP);
  if (!matches) throw new YError('E_MALFORMED_QUOTEDKEYVALUE', contents);

  const data = matches
    .map((part, partPosition) => {
      const [key, ...rest] = part.split(EQUAL);
      const value = rest.join(EQUAL);
      if (0 === rest.length) {
        throw new YError('E_MALFORMED_QUOTEDKEYVALUE', partPosition, part);
      }
      return [key, value];
    })
    .reduce(function (parsedValues, [name, value], valuePosition) {
      const normalizedName = name.toLowerCase();
      if (-1 === authorizedKeys.indexOf(normalizedName)) {
        throw new YError('E_UNAUTHORIZED_KEY', valuePosition, normalizedName);
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
       */
      const strippedValue = value.replace(/^"(.*(?="$))"$/, '$1');

      parsedValues[normalizedName] = valuesToNormalize.includes(normalizedName)
        ? strippedValue.toLowerCase()
        : strippedValue;

      return parsedValues;
    }, {});

  _checkRequiredKeys(requiredKeys, data);

  return data;
}

export function buildHTTPHeadersQuotedKeyValueSet(
  data: Record<string, string>,
  authorizedKeys: string[],
  requiredKeys: string[] = [],
): string {
  _checkRequiredKeys(requiredKeys, data);
  return authorizedKeys.reduce(function (contents, key) {
    if (data[key] !== undefined) {
      return (
        contents +
        (contents ? SEPARATOR : '') +
        key +
        EQUAL +
        QUOTE +
        data[key] +
        QUOTE
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
      throw new YError('E_REQUIRED_KEY', name);
    }
  });
}
