import { hasLazyStack, joinStacks, lazyJoinStacks } from "./stack";
import { ErrorPOJO, OnoError } from "./types";

const protectedProperties = ["name", "message", "stack"];

type Dict = Record<string, unknown>;

/**
 * Extends the new error with the properties of the original error and the `props` object.
 *
 * @param newError - The error object to extend
 * @param originalError - The original error object, if any
 * @param props - Additional properties to add, if any
 */
export function extendError(newError: OnoError, originalError?: ErrorPOJO, props?: object) {
  extendStack(newError, originalError);

  extend(newError, originalError);

  // JavaScript engines differ in how errors are serialized to JSON - especially when it comes
  // to custom error properties and stack traces.  So we add our own toJSON method that ALWAYS
  // outputs every property of the error.
  newError.toJSON = errorToJSON;

  // Add an inspect() method, for compatibility with Node.js' `util.inspect()` method
  newError.inspect = errorToString;

  // Copy custom properties, possibly including custom `toJSON()` and/or `inspect()` methods
  extend(newError, props);
}

/**
 * Extend the error stack to include its cause
 */
function extendStack(newError: OnoError, originalError?: ErrorPOJO): void {
  if (hasLazyStack(newError)) {
    lazyJoinStacks(newError, originalError);
  }
  else {
    newError.stack = joinStacks(newError, originalError);
  }
}

/**
 * Copies properties of the original error to the new error
 *
 * @param newError - The error object to extend
 * @param originalError - The original error object, if any
 */
function extend(newError: OnoError & Dict, originalError?: ErrorPOJO & Dict) {
  if (!originalError) {
    return;
  }

  for (let key in originalError) {
    // Don't copy "protected" properties, since they have special meaning/behavior
    // and are set by the ono constructor
    if (protectedProperties.indexOf(key) < 0) {
      try {
        newError[key] = originalError[key];
      }
      catch (e) {
        // This property is read-only, so it can't be copied
      }
    }
  }
}

/**
 * Custom JSON serializer for Error objects.
 * Returns all built-in error properties, as well as extended properties.
 */
function errorToJSON(this: OnoError & Dict): ErrorPOJO {
  let json: ErrorPOJO & Dict = {
    name: this.name,
    message: this.message,
  };

  for (let key in this) {
    if (protectedProperties.indexOf(key) < 0) {
      let value = this[key];
      let type = typeof value;
      if (type !== "undefined" && type !== "function") {
        json[key] = value;
      }
    }
  }

  // Add the stack property last. This looks better when printed, logged, debugging, etc.
  json.stack = this.stack;

  return json;
}

/**
 * Serializes Error objects as human-readable JSON strings for debugging/logging purposes.
 */
function errorToString(this: OnoError) {
  return JSON.stringify(this, undefined, 2).replace(/\\n/g, "\n");
}
