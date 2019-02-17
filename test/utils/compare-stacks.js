"use strict";

const { expect } = require("chai");
const { host } = require("host-environment");

module.exports = compareStacks;

/**
 * Compares an error's stack to see if it matches the expected trace.
 *
 * @param {...string[]} expected
 * An array of stacks, which are each an array of expected function names, in order
 *
 * @returns {function}
 */
function compareStacks (...expected) {
  /**
   * @param {string} [stack] - The error's stack, if any
   * @returns {boolean}
   */
  return function (stack) {
    try {
      let actual = parseStackEntries(stack);

      if (actual) {
        expect(actual).to.have.lengthOf(expected.length, "error.stack doesn't have the right number of stacks");

        for (let i = 0; i < expected.length; i++) {
          let expectedStack = expected[i];
          let actualStack = actual[i];

          for (let j = 0; j < expectedStack.length; j++) {
            expect(actualStack[j]).to.equal(expectedStack[j], `Stack entry ${i + 1}.${j + 1} does not match`);
          }
        }
      }

      return true;
    }
    catch (e) {
      console.error("\nEXPECTED: ", expected);
      console.error("\nACTUAL: ", stack);
      throw e;
    }
  };
}

/**
 * Parses an error's stack(s) into arrays of function names.
 *
 * @param {string} [stack] - The `error.stack` property
 * @returns {string[][]|undefined}
 */
function parseStackEntries (stack) {
  if (!stack) {
    return undefined;
  }

  let stacks = [];
  let stackEntries = null;
  let lines = stack.split("\n");

  for (let line of lines) {
    let match = /^    at (\S+) /.exec(line);
    if (match) {
      if (!stackEntries) {
        stackEntries = [];
      }
      stackEntries.push(match[1]);
    }
    else if (stackEntries) {
      stacks.push(stackEntries);
      stackEntries = null;
    }
  }

  if (stackEntries) {
    stacks.push(stackEntries);
  }

  return stacks;
}
