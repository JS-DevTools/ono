import util from "util";
import { getDeepKeys } from "./to-json";
import { ErrorPOJO, OnoError } from "./types";

/**
 * Adds an `inspect()` method to support Node's `util.inspect()` function.
 *
 * @see https://nodejs.org/api/util.html#util_util_inspect_custom
 */
export function addInspectMethod<T>(newError: OnoError<T>): void {
  newError[util.inspect.custom] = inspect;
}

/**
 * Returns a representation of the error for Node's `util.inspect()` method.
 *
 * @see https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects
 */
function inspect<T>(this: OnoError<T>): ErrorPOJO & T {
  // HACK: We have to cast the objects to `any` so we can use symbol indexers.
  // see https://github.com/Microsoft/TypeScript/issues/1863
  // tslint:disable: no-any no-unsafe-any
  let pojo: any = {};
  let error = this as any;

  for (let key of getDeepKeys(error)) {
    let value = error[key];
    pojo[key] = value;
  }

  // tslint:enable: no-any no-unsafe-any
  return pojo as ErrorPOJO & T;
}
