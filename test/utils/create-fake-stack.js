"use strict";

const host = require("./host");

module.exports = createFakeStack;

/**
 * Creates a fake error stack, based on the current host environment.
 *
 * @param {...{ fn: string, file: string, line: number, col: number }} entries
 * An array of fake stack entries
 *
 * @returns {string}
 */
function createFakeStack (...entries) {
  let stack = "";

  if (host.error.stack.includesErrorMessage) {
    stack += "Error: This is a fake error\n";
  }

  for (let { fn, file, line, col } of entries) {
    if (host.browser.firefox || host.browser.safari) {
      stack += `${fn}@${file}:${line}:${col}\n`;
    }
    else {
      stack += `    at ${fn} (${file}:${line}:${col})\n`;
    }
  }

  return stack;
}
