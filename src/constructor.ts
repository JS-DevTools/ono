import { extendError } from "./extend-error";
import { normalizeArgs, normalizeOptions } from "./normalize";
import { toJSON as errorToJSON } from "./to-json";
import { ErrorLike, ErrorLikeConstructor, ErrorLikeConstructorClass, ErrorPOJO, OnoConstructor, OnoError, OnoOptions } from "./types";

const constructor = Ono as OnoConstructor;
export { constructor as Ono };

/**
 * Returns an object containing all properties of the given Error object,
 * which can be used with `JSON.stringify()`.
 */
Ono.toJSON = function toJSON<E extends ErrorLike>(error: E) {
  return errorToJSON.call(error) as ErrorPOJO & E;
};

/**
 * Creates an `Ono` instance for a specifc error type.
 */
// tslint:disable-next-line: variable-name
function Ono<T extends ErrorLike>(ErrorConstructor: ErrorLikeConstructor<T>, options?: OnoOptions) {
  options = normalizeOptions(options);

  function ono<E extends ErrorLike, P extends object>(...args: unknown[]) {
    let { originalError, props, message } = normalizeArgs<E, P>(args, options!);

    // Create a new error of the specified type
    let newError = new (ErrorConstructor as ErrorLikeConstructorClass<T>)(message) as T & E & P & OnoError<T & E & P>;

    // Extend the error with the properties of the original error and the `props` object
    extendError(newError, originalError, props);

    return newError;
  }

  ono[Symbol.species] = ErrorConstructor;
  return ono;
}
