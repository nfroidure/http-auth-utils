import YError from 'yerror';

const QUOTE = '"';
const EQUAL = '=';
const SEPARATOR = ', ';
const SEPARATOR_REGEXP = /", ?/;

// FIXME: Create a real parser
export function parseHTTPHeadersQuotedKeyValueSet(
  contents: string,
  authorizedKeys: string[],
  requiredKeys = [],
): Record<string, string> {
  const data = contents
    .split(SEPARATOR_REGEXP)
    .map((part, partPosition, parts) => {
      part = parts.length - 1 === partPosition ? part : part + '"';
      const pair = part.split(EQUAL);

      if (2 !== pair.length) {
        throw new YError(
          'E_MALFORMED_QUOTEDKEYVALUE',
          partPosition,
          part,
          pair.length,
        );
      }
      return pair;
    })
    .reduce(function (parsedValues, [name, value], valuePosition) {
      if (-1 === authorizedKeys.indexOf(name)) {
        throw new YError('E_UNAUTHORIZED_KEY', valuePosition, name);
      }
      if (QUOTE !== value[0] || QUOTE !== value[value.length - 1]) {
        throw new YError('E_UNQUOTED_VALUE', valuePosition, name, value);
      }
      parsedValues[name] = value.substr(1, value.length - 2);
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
    if (data[key]) {
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
