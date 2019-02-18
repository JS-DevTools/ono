import { hasLazyStack, joinStacks, lazyJoinStacks } from "./stack";
import { ErrorPOJO, OnoError } from "./types";

const nonJsonTypes = ["function", "symbol", "undefined"];
const objectPrototype = Object.getPrototypeOf({});

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
  extend(newError, props, true);
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
 * Copies properties of the given object to the new error
 *
 * @param newError - The error object to extend
 * @param props - The original error object, if any
 * @param overwrite - Whether to overwrite existing properties of `newError`
 */
function extend(newError: OnoError, props?: object, overwrite = false) {
  if (!props) {
    return;
  }

  for (let key of getDeepKeys(props)) {
    // @ts-ignore - https://github.com/Microsoft/TypeScript/issues/1863
    if (overwrite || newError[key] === undefined) {
      try {
        // @ts-ignore - https://github.com/Microsoft/TypeScript/issues/1863
        newError[key] = props[key];
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
function errorToJSON(this: OnoError): ErrorPOJO {
  let json: ErrorPOJO = {};

  for (let key of getDeepKeys(this)) {
    // @ts-ignore - https://github.com/Microsoft/TypeScript/issues/1863
    let value = this[key];
    let type = typeof value;

    if (!nonJsonTypes.includes(type)) {
      // @ts-ignore - https://github.com/Microsoft/TypeScript/issues/1863
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
 * Returns own, inherited, enumerable, non-enumerable, string, and symbol keys of `obj`.
 * Does NOT return members of the base Object prototype or members that could alter the prototype
 * chain, such as "prototype", "__proto__", "constructor", etc.
 */
function getDeepKeys(obj: object): Set<string | symbol> {
  let keys: Array<string | symbol> = [];

  while (obj && obj !== objectPrototype) {
    keys = keys.concat(
      Object.getOwnPropertyNames(obj),
      Object.getOwnPropertySymbols(obj),
    );
    obj = Object.getPrototypeOf(obj) as object;
  }

  let uniqueKeys = new Set(keys);
  uniqueKeys.delete("constructor");
  uniqueKeys.delete("prototype");
  uniqueKeys.delete("__proto__ ");

  return uniqueKeys;
}
