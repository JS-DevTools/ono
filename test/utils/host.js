"use strict";

const { host } = require("@jsdevtools/host-environment");
const sampleError = getSampleError();
const sampleCustomError = getSampleCustomError();

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
       * Safari normally includes the function name, but not with code coverage instrumentation.
       */
      includesFunctionNames: sampleError.stack.includes("getSampleError") && !host.browser.safari,

      /**
       * Indicates whether the stack traces include error class names
       *
       * As of April 2020, only Firefox does this
       */
      includesClassNames: sampleCustomError.stack.includes("MyCustomError"),
    }
  },
});

function getSampleError () {
  return new Error("THIS IS THE MESSAGE");
}

function getSampleCustomError () {
  class MyCustomError extends Error {}
  return new MyCustomError("THIS IS THE MESSAGE");
}

function hasKey (error, key) {
  return (key in error) || (error[key] !== undefined);
}

function isEnumerable (error, key) {
  let descriptor = Object.getOwnPropertyDescriptor(error, key);
  return Boolean(descriptor && descriptor.enumerable);
}
