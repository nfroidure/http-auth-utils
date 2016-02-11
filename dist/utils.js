'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _yerror = require('yerror');

var _yerror2 = _interopRequireDefault(_yerror);

var QUOTE = '"';
var EQUAL = '=';
var SEPARATOR = ', ';
var SEPARATOR_REGEXP = /", ?/;

// FIXME: Create a real parser
var parseHTTPHeadersQuotedKeyValueSet = function parseHTTPHeadersQuotedKeyValueSet(contents, authorizedKeys) {
  var requiredKeys = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  return contents.split(SEPARATOR_REGEXP).map(function (part, partPosition, parts) {
    part = parts.length - 1 === partPosition ? part : part + '"';
    var pair = part.split(EQUAL);
    if (2 !== pair.length) {
      throw new _yerror2['default']('E_MALFORMED_QUOTEDKEYVALUE', partPosition, part, pair.length);
    }
    return pair;
  }).reduce(function (parsedValues, _ref, valuePosition) {
    var _ref2 = _slicedToArray(_ref, 2);

    var name = _ref2[0];
    var value = _ref2[1];

    if (-1 === authorizedKeys.indexOf(name)) {
      throw new _yerror2['default']('E_UNAUTHORIZED_KEY', valuePosition, name);
    }
    if (QUOTE !== value[0] || QUOTE !== value[value.length - 1]) {
      throw new _yerror2['default']('E_UNQUOTED_VALUE', valuePosition, name, value);
    }
    parsedValues[name] = value.substr(1, value.length - 2);
    return parsedValues;
  }, {});
};

exports.parseHTTPHeadersQuotedKeyValueSet = parseHTTPHeadersQuotedKeyValueSet;
var buildHTTPHeadersQuotedKeyValueSet = function buildHTTPHeadersQuotedKeyValueSet(data, authorizedKeys) {
  var requiredKeys = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  return authorizedKeys.reduce(function (contents, key) {
    if (data[key]) {
      return contents + (contents ? ', ' : '') + key + EQUAL + QUOTE + data[key] + QUOTE;
    }
    return contents;
  }, '');
};
exports.buildHTTPHeadersQuotedKeyValueSet = buildHTTPHeadersQuotedKeyValueSet;