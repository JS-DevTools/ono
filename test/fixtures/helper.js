(function () {
  'use strict';

  /**
   * Helper methods for use in tests
   */
  global.helper = {
    forEachMethod: forEachMethod,
    matchesJSON: matchesJSON
  };

  /**
   * Invokes the given function for each {@link Ono} method
   *
   * @param {function} fn - The function that's invoked for each method
   */
  function forEachMethod (fn) {
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
   * @param {object} expected - The expected properties & values
   * @returns {function}
   */
  function matchesJSON (expected) {
    return function (json) {
      try {
        if (host.browser.firefox) {
          expect(json.fileName).to.be.a('string').and.not.empty;
          expect(json.lineNumber).to.be.a('number').above(0);
          expect(json.columnNumber).to.be.a('number').above(0);
          expected.fileName = json.fileName;
          expected.lineNumber = json.lineNumber;
          expected.columnNumber = json.columnNumber;
        }

        // Only recent versions of Safari include these properties
        if (host.browser.safari && json.sourceURL && json.line && json.column) {
          expect(json.sourceURL).to.be.a('string').and.not.empty;
          expect(json.line).to.be.a('number').above(0);
          expect(json.column).to.be.a('number').above(0);
          expected.sourceURL = json.sourceURL;
          expected.line = json.line;
          expected.column = json.column;
        }

        if (host.browser.IE && 'description' in json) {
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
      catch (e) {
        console.error('\nEXPECTED: ', expected);
        console.error('\nACTUAL: ', json);
        throw e;
      }
    };
  }
}());
