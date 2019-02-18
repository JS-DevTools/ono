import { ErrorPOJO, OnoError } from "./types";

const nonJsonTypes = ["function", "symbol", "undefined"];
const objectPrototype = Object.getPrototypeOf({});

/**
 * Custom JSON serializer for Error objects.
 * Returns all built-in error properties, as well as extended properties.
 */
export function errorToJSON(this: OnoError): ErrorPOJO {
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
export function errorInspect(this: OnoError) {
  return JSON.stringify(this, undefined, 2).replace(/\\n/g, "\n");
}

/**
 * Returns own, inherited, enumerable, non-enumerable, string, and symbol keys of `obj`.
 * Does NOT return members of the base Object prototype or members that could alter the prototype
 * chain, such as "prototype", "__proto__", "constructor", etc.
 */
export function getDeepKeys(obj: object): Set<string | symbol> {
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
