/* eslint-env browser */
"use strict";

module.exports = makeDOMError;

function makeDOMError () {
  let name = "DOMError";
  let message = "This is a DOM error";

  try {
    // Try creating a DOMError
    return new DOMError(name, message);
  }
  catch (e) {
    // DOMError is not supported, so return a POJO instead
    return { name, message };
  }
}
