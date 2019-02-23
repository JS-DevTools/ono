"use strict";

const { expect } = require("chai");
const host = require("./host");

module.exports = compareKeys;

/**
 * Assets that the given error object has _exactly_ the specified keys.
 *
 * @param {..string} expected - The expected keys that should exist on the error
 */
function compareKeys (...expected) {
  /**
   * @param {Error} error - The actual error object
   * @returns {boolean}
   */
  return function (error) {
    let actual = [];

    // Make sure all the specified keys exist
    for (let key of expected) {
      if (key in error) {
        actual.push(key);
      }
    }

    // Make sure the error doesn't have any extra keys
    // eslint-disable-next-line guard-for-in
    for (let key in error) {
      if (!actual.includes(key)) {
        actual.push(key);
      }
    }

    if ((host.browser.IE || host.browser.edge) && actual.includes("description")) {
      expected.push("description");
    }

    try {
      expect(actual).to.have.same.members(expected);
    }
    catch (e) {
      console.error(`
EXPECTED:
  ${expected.join("\n  ")}

ACTUAL:
  ${actual.join("\n  ")}
`);
      throw e;
    }

    return true;
  };
}
