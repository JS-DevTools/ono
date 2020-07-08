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
    let actual = new Set();

    // Make sure all the specified keys exist
    for (let key of expected) {
      if (key in error) {
        actual.add(key);
      }
    }

    // Make sure the error doesn't have any extra keys
    // eslint-disable-next-line guard-for-in
    for (let key in error) {
      actual.add(key);
    }

    if (host.error.hasColumn && "column" in error) {
      actual.add("column");
      expected.push("column");
    }

    if (host.error.hasLine && "line" in error) {
      actual.add("line");
      expected.push("line");
    }

    if (host.error.hasSourceURL && "sourceURL" in error) {
      actual.add("sourceURL");
      expected.push("sourceURL");
    }

    if (host.error.hasEnumerableDescription && "description" in error) {
      actual.add("description");
      expected.push("description");
    }

    try {
      actual = [...actual];
      expect(actual).to.have.same.members(expected);
    }
    catch (e) {
      console.error(`
EXPECTED KEYS:
  ${expected.join("\n  ")}

ACTUAL KEYS:
  ${actual.join("\n  ")}
`);
      throw e;
    }

    return true;
  };
}
