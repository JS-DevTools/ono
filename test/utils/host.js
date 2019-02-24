"use strict";

const { host } = require("host-environment");
const sampleError = getSampleError();

module.exports = Object.assign({}, host, {
  error: {
    /**
     * Indicates whether Error objects have a `description` property.
     */
    hasDescription: hasKey(sampleError, "description"),

    /**
     * Indicates whether Error objects have a `description` property that is enumerable.
     */
    hasEnumerableDescription: isEnumerable(sampleError, "description"),

    /**
     * Indicates whether Error objects have a `line` property.
     */
    hasLine: hasKey(sampleError, "line"),

    /**
     * Indicates whether Error objects have a `column` property.
     */
    hasColumn: hasKey(sampleError, "column"),

    /**
     * Indicates whether Error objects have a `sourceURL` property.
     */
    hasSourceURL: hasKey(sampleError, "sourceURL"),

    /**
     * Indicates whether Error objects have a `lineNumber` property.
     */
    hasLineNumber: hasKey(sampleError, "lineNumber"),

    /**
     * Indicates whether Error objects have a `columnNumber` property.
     */
    hasColumnNumber: hasKey(sampleError, "columnNumber"),

    /**
     * Indicates whether Error objects have a `fileName` property.
     */
    hasFileName: hasKey(sampleError, "fileName"),

    stack: hasKey(sampleError, "stack") && {
      /**
       * Indicates whether stack traces include the error name and message
       */
      includesErrorMessage: sampleError.stack.includes("THIS IS THE MESSAGE"),

      /**
       * Indicates whether the stack traces include function names
       *
       * IE 11 and older do not include stack traces at all.
       * Safari includes the script URL and line number, but no function name.
       */
      includesFunctionNames: sampleError.stack.includes("getSampleError"),
    }
  },
});

console.log(`
=======================================================
=======================================================

host = ${JSON.stringify(module.exports.error, null, 2)}

sampleError = ${JSON.stringify(sampleError, null, 2)}

=======================================================
=======================================================
`);

function getSampleError () {
  return new Error("THIS IS THE MESSAGE");
}

function hasKey (error, key) {
  return (key in error) || (error[key] !== undefined);
}

function isEnumerable (error, key) {
  let descriptor = Object.getOwnPropertyDescriptor(error, key);
  return Boolean(descriptor && descriptor.enumerable);
}
