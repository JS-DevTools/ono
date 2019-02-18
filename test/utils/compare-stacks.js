"use strict";

const { expect } = require("chai");
const host = require("./host");

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
      let actual = parseStacks(stack);

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
function parseStacks (stack) {
  if (!stack || !host.STACK_TRACES_HAVE_FUNCTION_NAMES) {
    return undefined;
  }

  let stacks = [];
  let functionNames = null;
  let lines = stack.split("\n");

  for (let line of lines) {
    let functionName = parseFunctionName(line);
    if (typeof functionName === "string") {
      if (!functionNames) {
        functionNames = [];
      }
      functionNames.push(functionName);
    }
    else if (functionNames) {
      stacks.push(functionNames);
      functionNames = null;
    }
  }

  if (functionNames) {
    stacks.push(functionNames);
  }

  return stacks;
}

/**
 * Returns the function name from a single line of a stack trace.
 *
 * @param {string} line
 * @returns {string}
 */
function parseFunctionName (line) {
  let pattern;

  if (host.browser.firefox) {
    pattern = /^(\S+)\@/;
  }
  else {
    pattern = /^ + at (\S+)/;
  }

  let match = pattern.exec(line);
  if (match) {
    return match[1];
  }
}
