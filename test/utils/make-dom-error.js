"use strict";

module.exports = makeDOMError;

function makeDOMError () {
  let domError;
  let errorName = "DOMError";
  let errorMessage = "This is a DOM error";

  try {
    // Try creating a DOMError
    domError = new DOMError(errorName, errorMessage);
  }
  catch (e) {
    try {
      // DOMError is not supported, so try a DOMException instead
      domError = new DOMException(errorMessage, errorName);
    }
    catch (e2) {
      // DOMException is also not supported
    }
  }

  if (!domError) {
    // Just return a POJO instead
    domError = { name: errorName, message: errorMessage };
  }

  return domError;
}
