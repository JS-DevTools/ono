"use strict";

const { expect } = require("chai");
const host = require("./host");

module.exports = comparePOJO;

/**
 * Compares the results of the `Error.toJSON()` or `Error.inspect()` method against
 * the expected value, taking host-specific quirks into account.
 *
 * @param {object} expected - The expected properties & values
 * @returns {function}
 */
function comparePOJO (expected) {
  /**
   * @param {object} actual - The JSON-ified Error
   * @returns {boolean}
   */
  return function (actual) {
    if (host.error.hasColumn) {
      expect(actual.column).to.be.a("number").above(0);
      expected.column = actual.column;
    }

    if (host.error.hasColumnNumber) {
      expect(actual.columnNumber).to.be.a("number").above(0);
      expected.columnNumber = actual.columnNumber;
    }

    if (host.error.hasLine) {
      expect(actual.line).to.be.a("number").above(0);
      expected.line = actual.line;
    }

    if (host.error.hasLineNumber) {
      expect(actual.lineNumber).to.be.a("number").above(0);
      expected.lineNumber = actual.lineNumber;
    }

    if (host.error.hasFileName) {
      expect(actual.fileName).to.be.a("string").and.not.empty;
      expected.fileName = actual.fileName;
    }

    if (host.error.hasSourceURL) {
      expect(actual.sourceURL).to.be.a("string").and.not.empty;
      expected.sourceURL = actual.sourceURL;
    }

    // IE & Edge have a `description` field on SOME error types, but not all
    if (host.error.hasDescription && "description" in actual) {
      expect(actual.description).to.be.a("string");
      expected.description = actual.description;
    }

    if (!host.error.stack) {
      // Some browsers don't support the "stack" property
      delete expected.stack;
    }

    try {
      expect(actual).to.deep.equal(expected);

      // Chai's `deep.equal()` doesn't currently support symbols
      // https://github.com/chaijs/chai/projects/2#card-10444215
      for (let sym of Object.getOwnPropertySymbols(expected)) {
        expect(actual).to.have.property(sym, expected[sym]);
      }
      for (let sym of Object.getOwnPropertySymbols(actual)) {
        expect(expected).to.have.property(sym, actual[sym]);
      }
    }
    catch (e) {
      console.error(`
EXPECTED:
  ${prettyPrint(expected, "  ")}

ACTUAL:
  ${prettyPrint(actual, "  ")}
`);
      throw e;
    }

    return true;
  };
}

/**
 * A simplistic implementation of Node's `util.format()`
 */
function prettyPrint (obj, indent) {
  let json = "{\n";

  // eslint-disable-next-line guard-for-in
  for (let key in obj) {
    json += `${indent}  ${key}: ${prettyPrintValue(obj[key], indent)}\n`;
  }

  for (let sym of Object.getOwnPropertySymbols(obj)) {
    json += `${indent}  [${String(sym)}]: ${prettyPrintValue(obj[sym], indent)}\n`;
  }

  json += `${indent}}\n`;
  return json;
}

function prettyPrintValue (value, indent) {
  let type = typeof value;

  switch (type) {
    case "string":
      return JSON.stringify(value);

    case "number":
    case "boolean":
    case "undefined":
    case "symbol":
      return String(value);

    case "function":
      return `[function ${value.name}]`;

    default:
      if (value === null) {
        return "null";
      }
      else if (typeof value.toJSON === "function") {
        return prettyPrintValue(value.toJSON(), indent);
      }
      else {
        let str = String(value);
        if (str === "[object Object]") {
          return prettyPrint(value, `${indent}  `);
        }
        else {
          return str;
        }
      }
  }
}
