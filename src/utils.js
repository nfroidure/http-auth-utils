import YError from 'yerror';

const QUOTE = '"';
const EQUAL = '=';
const SEPARATOR = ', ';
const SEPARATOR_REGEXP = /", ?/;

// FIXME: Create a real parser
export const parseHTTPHeadersQuotedKeyValueSet =
  function parseHTTPHeadersQuotedKeyValueSet(contents, authorizedKeys, requiredKeys = []) {
    return contents.split(SEPARATOR_REGEXP).map(function(part, partPosition, parts) {
      part = parts.length - 1 === partPosition ? part : part + '"';
      let pair = part.split(EQUAL);
      if(2 !== pair.length) {
        throw new YError('E_MALFORMED_QUOTEDKEYVALUE', partPosition, part, pair.length);
      }
      return pair;
    }).reduce(function(parsedValues, [name, value], valuePosition) {
      if(-1 === authorizedKeys.indexOf(name)) {
        throw new YError('E_UNAUTHORIZED_KEY', valuePosition, name);
      }
      if(QUOTE !== value[0] || QUOTE !== value[value.length - 1]) {
        throw new YError('E_UNQUOTED_VALUE', valuePosition, name, value);
      }
      parsedValues[name] = value.substr(1, value.length - 2);
      return parsedValues;
    }, {});
  };

export const buildHTTPHeadersQuotedKeyValueSet =
  function buildHTTPHeadersQuotedKeyValueSet(data, authorizedKeys, requiredKeys = []) {
    return authorizedKeys.reduce(function(contents, key) {
      if(data[key]) {
        return contents + (contents ? ', ' : '') + key + EQUAL +
          QUOTE + data[key] + QUOTE;
      }
      return contents;
    }, '');
  };
