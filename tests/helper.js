'use strict';

var isBrowser = typeof(window) === 'object';

var helper = {
  isNode: !isBrowser,
  isBrowser: isBrowser,
  isSafari: isBrowser && /Safari/.test(navigator.userAgent),
  isFirefox: isBrowser && /Firefox/.test(navigator.userAgent),
  isIE: isBrowser && /Trident/.test(navigator.userAgent),
  isChrome: !isBrowser || /Chrome/.test(navigator.userAgent),  // isChrome === true for Node
  forEachMethod: forEachMethod,
  matchesJSON: matchesJSON
};

if (helper.isNode) {
  // We're running in Node, so just export the helper object
  module.exports = helper;
}
else if (helper.isBrowser) {
  // We're running in a browser, so mimic the Node environment
  window.global = window;
  window.helper = helper;

  // Fake `require()` for browsers
  window.require = function(name) {
    name = name.substr(name.lastIndexOf('/') + 1);
    return name ? window[name] : window.ono;
  }
}

/**
 * Set global settings for all tests
 */
beforeEach(function() {
  this.currentTest.timeout(2000);
  this.currentTest.slow(100);
});

/**
 * Invokes the given function for each {@link Ono} method
 *
 * @param {function} fn
 */
function forEachMethod(fn) {
  var ono = require('../');
  var names = ['', 'error', 'eval', 'range', 'reference', 'syntax', 'type', 'uri'];
  var types = ['Error', 'Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'];

  for (var i = 0; i < names.length; i++) {
    var name, method;

    if (i === 0) {
      name = 'ono()';
      method = ono;
    }
    else {
      name = 'ono.' + names[i] + '()';
      method = ono[names[i]];
    }

    var type = types[i];
    fn(name, method, global[type], type);
  }
}

/**
 * Asserts that a JSON-serialized Error has the expected properties & values.
 *
 * @param {object} expected
 * @returns {function}
 */
function matchesJSON(expected) {
  var expect = require('chai').expect;

  return function(json) {
    if (helper.isFirefox) {
      expect(json.fileName).to.be.a('string').and.not.empty;
      expect(json.lineNumber).to.be.a('number').above(0);
      expect(json.columnNumber).to.be.a('number').above(0);
      expected.fileName = json.fileName;
      expected.lineNumber = json.lineNumber;
      expected.columnNumber = json.columnNumber;
    }

    if (helper.isIE && 'description' in json) {
      expect(json.description).to.be.a('string');
      expected.description = json.description;
    }

    if (!('stack' in json)) {
      // Some browsers don't support the "stack" property
      delete expected.stack;
    }

    expect(json).to.deep.equal(expected);
    return true;
  }
}
