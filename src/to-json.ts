import { ErrorPOJO, OnoError } from "./types";

const nonJsonTypes = ["function", "symbol", "undefined"];
const protectedProps = ["constructor", "prototype", "__proto__"];
const objectPrototype = Object.getPrototypeOf({});

/**
 * Custom JSON serializer for Error objects.
 * Returns all built-in error properties, as well as extended properties.
 */
export function toJSON<T>(this: OnoError<T>): ErrorPOJO & T {
  // HACK: We have to cast the objects to `any` so we can use symbol indexers.
  // see https://github.com/Microsoft/TypeScript/issues/1863
  // tslint:disable: no-any no-unsafe-any
  let pojo: any = {};
  let error = this as any;

  for (let key of getDeepKeys(error)) {
    let value = error[key];
    let type = typeof value;

    if (!nonJsonTypes.includes(type)) {
      pojo[key] = value;
    }
  }

  // tslint:enable: no-any no-unsafe-any
  return pojo as ErrorPOJO & T;
}


/**
 * Returns own, inherited, enumerable, non-enumerable, string, and symbol keys of `obj`.
 * Does NOT return members of the base Object prototype, or the specified omitted keys.
 */
export function getDeepKeys(obj: object, omit: Array<string | symbol> = []): Set<string | symbol> {
  let keys: Array<string | symbol> = [];

  // Crawl the prototype chain, finding all the string and symbol keys
  while (obj && obj !== objectPrototype) {
    keys = keys.concat(
      Object.getOwnPropertyNames(obj),
      Object.getOwnPropertySymbols(obj),
    );
    obj = Object.getPrototypeOf(obj) as object;
  }

  // De-duplicate the list of keys
  let uniqueKeys = new Set(keys);

  // Remove any omitted keys
  for (let key of omit.concat(protectedProps)) {
    uniqueKeys.delete(key);
  }

  return uniqueKeys;
}
