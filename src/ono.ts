let format = require("format-util");
// import * as format from "format-util";

const slice = Array.prototype.slice;
const protectedProperties = ["name", "message", "stack"];
const errorPrototypeProperties = [
  "name", "message", "description", "number", "code", "fileName", "lineNumber", "columnNumber",
  "sourceURL", "line", "column", "stack"
];

module.exports = create(Error);
module.exports.error = create(Error);
module.exports.eval = create(EvalError);
module.exports.range = create(RangeError);
module.exports.reference = create(ReferenceError);
module.exports.syntax = create(SyntaxError);
module.exports.type = create(TypeError);
module.exports.uri = create(URIError);
module.exports.formatter = format;


type ErrorTypes = ErrorConstructor | EvalErrorConstructor | RangeErrorConstructor |
                  ReferenceErrorConstructor | SyntaxErrorConstructor | TypeErrorConstructor | URIErrorConstructor;


interface OnoError extends Error {
  toJSON?(): object;
  inspect?(): string;
}

/**
 * Creates a new `ono` function that creates the given Error class.
 */
function create(klass: ErrorTypes): Error {
  /**
   * @param {Error}   [err]     - The original error, if any
   * @param {object}  [props]   - An object whose properties will be added to the error object
   * @param {string}  [message] - The error message. May contain {@link util#format} placeholders
   * @param {...*}    [params]  - Parameters that map to the `message` placeholders
   * @returns {Error}
   */

  // TODO: Params not being used?
  return function onoFactory(err?: string | Error, props?: object, message?: string, params?: unknown): OnoError {

    let formatArgs = [];
    let formattedMessage = "";

    // Determine which arguments were actually specified
    if (typeof err === "string") {
      formatArgs = slice.call(arguments);
      err = props = undefined;
    }
    else if (typeof props === "string") {
      formatArgs = slice.call(arguments, 1);
      props = undefined;
    }
    else if (typeof message === "string") {
      formatArgs = slice.call(arguments, 2);
    }

    // If there are any format arguments, then format the error message
    if (formatArgs.length > 0) {
      formattedMessage = module.exports.formatter.apply(undefined, formatArgs);
    }

    if (err && err.message) {
      // The inner-error's message will be added to the new message
      formattedMessage += (formattedMessage ? " \n" : "") + err.message;
    }

    // Create the new error
    // NOTE: DON'T move this to a separate function! We don't want to pollute the stack trace
    let newError = new klass(formattedMessage);

    // Extend the new error with the additional properties
    extendError(newError, err);   // Copy properties of the original error
    extendToJSON(newError);       // Replace the original toJSON method
    extend(newError, props);      // Copy custom properties, possibly including a custom toJSON method

    return newError;
  };
}

/**
 * Extends the targetError with the properties of the source error.
 *
 * @param targetError - The error object to extend
 * @param sourceError - The source error object, if any
 */
function extendError(targetError: Error, sourceError?: Error) {
  extendStack(targetError, sourceError);
  extend(targetError, sourceError);
}


/**
 * JavaScript engines differ in how errors are serialized to JSON - especially when it comes
 * to custom error properties and stack traces.  So we add our own toJSON method that ALWAYS
 * outputs every property of the error.
 */
function extendToJSON(error: OnoError) {
  error.toJSON = errorToJSON;

  // Also add an inspect() method, for compatibility with Node.js' `util.inspect()` method
  error.inspect = errorToString;

  return error;
}

/**
 * Extends the target object with the properties of the source object.
 *
 * @param target - The object to extend
 * @param source - The object whose properties are copied
 */
function extend(target: Record<string, unknown>, source?: Record<string, unknown>) {
  if (source) {
    let keys = Object.keys(source);

    keys.forEach((key, index) => {

      // Don't copy "protected" properties, since they have special meaning/behavior
      // and are set by the onoFactory function
      if (protectedProperties.indexOf(key) < 0) {
        try {
          target[key] = source[key];
        }
        catch (e) {
          // This property is read-only, so it can't be copied
        }
      }
    });
  }
}

/**
 * Custom JSON serializer for Error objects.
 * Returns all built-in error properties, as well as extended properties.
 */
function errorToJSON(this: Record<string, unknown>): object {
  let json: Record<string, unknown> = {};

  // Get all the properties of this error
  let keys = Object.keys(this);

  // Also include properties from the Error prototype
  keys = keys.concat(errorPrototypeProperties);

  for (let key of keys) {
    let value = this[key];
    let type = typeof value;
    if (type !== "undefined" && type !== "function") {
      json[key] = value;
    }
  }

  return json;
}

/**
 * Serializes Error objects as human-readable JSON strings for debugging/logging purposes.
 */
function errorToString(this: OnoError) {
  return JSON.stringify(this, undefined, 2).replace(/\\n/g, "\n");
}

/**
 * Extend the error stack to include its cause
 */
function extendStack(targetError: Error, sourceError?: Error): void {
  if (hasLazyStack(targetError)) {
    if (sourceError) {
      lazyJoinStacks(targetError, sourceError);
    }
    else {
      lazyPopStack(targetError);
    }
  }
  else {
    if (sourceError) {
      targetError.stack = joinStacks(targetError.stack, sourceError.stack);
    }
    else {
      targetError.stack = popStack(targetError.stack);
    }
  }
}

/**
 * Appends the original `Error.stack` property to the new Error's stack.
 */
function joinStacks(newStack: string, originalStack: string): string {
  newStack = popStack(newStack);

  if (newStack && originalStack) {
    return newStack + "\n\n" + originalStack;
  }
  else {
   return newStack || originalStack;
  }
}

/**
 * Removes Ono from the stack, so that the stack starts at the original error location
 */
function popStack(stack: string): string {
  if (stack) {
    let lines = stack.split("\n");

    if (lines.length < 2) {
      // The stack only has one line, so there's nothing we can remove
      return stack;
    }

    // Find the `onoFactory` call in the stack, and remove it
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.indexOf("onoFactory") >= 0) {
        lines.splice(i, 1);
        return lines.join("\n");
      }
    }

    // If we get here, then the stack doesn't contain a call to `onoFactory`.
    // This may be due to minification or some optimization of the JS engine.
    // So just return the stack as-is.
    return stack;
  }

  return "";
}

// /**
//  * Does a one-time determination of whether this JavaScript engine
//  * supports lazy `Error.stack` properties.
//  */
let supportsLazyStack = (() => {
  return !!(
    // ES5 property descriptors must be supported
    Object.getOwnPropertyDescriptor && Object.defineProperty &&

    // Chrome on Android doesn't support lazy stacks :(
    (typeof navigator === "undefined" || !/Android/.test(navigator.userAgent))
  );
})();

// /**
//  * Does this error have a lazy stack property?
//  *
//  * @param {Error} err
//  * @returns {boolean}
//  */
function hasLazyStack(err: Error) {
  if (!supportsLazyStack) {
    return false;
  }

  let descriptor = Object.getOwnPropertyDescriptor(err, "stack");
  if (!descriptor) {
    return false;
  }
  return typeof descriptor.get === "function";
}

/**
 * Calls `joinStacks` lazily, when the `Error.stack` property is accessed.
 */
function lazyJoinStacks(targetError: Error, sourceError: Error) {
  let targetStack = Object.getOwnPropertyDescriptor(targetError, "stack");

  Object.defineProperty(targetError, "stack", {
    get: () => {
      if (targetStack) {
        if (typeof sourceError.stack === "string") {
          return joinStacks(targetStack.get.apply(targetError), sourceError.stack);
        }
      }
    },
    enumerable: false,
    configurable: true
  });
}

/**
 * Calls `popStack` lazily, when the `Error.stack` property is accessed.
 */
function lazyPopStack(error: Error) {
  let targetStack = Object.getOwnPropertyDescriptor(error, "stack");


  Object.defineProperty(error, "stack", {
    get: () => {
      if (targetStack && targetStack.get) {
        return popStack(targetStack.get.apply(error));
      }
    },
    enumerable: false,
    configurable: true
  });
}
