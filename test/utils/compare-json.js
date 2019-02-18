"use strict";

const { expect } = require("chai");
const host = require("./host");

module.exports = compareJSON;

/**
 * Compares a JSON-ified Error against the expected value, taking host-specific quirks into account.
 *
 * @param {object} expected - The expected properties & values
 * @returns {function}
 */
function compareJSON (expected) {
  /**
   * @param {object} actual - The JSON-ified Error
   * @returns {boolean}
   */
  return function (actual) {
    try {
      if (host.browser.firefox) {
        expect(actual.fileName).to.be.a("string").and.not.empty;
        expect(actual.lineNumber).to.be.a("number").above(0);
        expect(actual.columnNumber).to.be.a("number").above(0);
        expected.fileName = actual.fileName;
        expected.lineNumber = actual.lineNumber;
        expected.columnNumber = actual.columnNumber;
      }

      // Only recent versions of Safari include these properties
      if (host.browser.safari && actual.sourceURL && actual.line && actual.column) {
        expect(actual.sourceURL).to.be.a("string").and.not.empty;
        expect(actual.line).to.be.a("number").above(0);
        expect(actual.column).to.be.a("number").above(0);
        expected.sourceURL = actual.sourceURL;
        expected.line = actual.line;
        expected.column = actual.column;
      }

      if ((host.browser.IE || host.browser.edge) && "description" in actual) {
        expect(actual.description).to.be.a("string");
        expected.description = actual.description;
      }

      if (!("stack" in actual)) {
        // Some browsers don't support the "stack" property
        delete expected.stack;
      }

      expect(actual).to.deep.equal(expected);
      return true;
    }
    catch (e) {
      console.error("\nEXPECTED: ", expected);
      console.error("\nACTUAL: ", actual);
      throw e;
    }
  };
}
