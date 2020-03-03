import { extendError } from "./extend-error";
import { normalizeArgs, normalizeOptions } from "./normalize";
import { toJSON as errorToJSON } from "./to-json";
import { ErrorLike, ErrorLikeConstructor, ErrorLikeConstructorClass, OnoConstructor, OnoOptions } from "./types";

const constructor = Ono as OnoConstructor;
export { constructor as Ono };

/**
 * Creates an `Ono` instance for a specifc error type.
 */
// tslint:disable-next-line: variable-name
function Ono<T extends ErrorLike>(ErrorConstructor: ErrorLikeConstructor<T>, options?: OnoOptions) {
  options = normalizeOptions(options);

  function ono<E extends ErrorLike, P extends object>(...args: unknown[]) {
    let { originalError, props, message } = normalizeArgs<E, P>(args, options!);

    // Create a new error of the specified type
    let newError = new (ErrorConstructor as ErrorLikeConstructorClass<T>)(message);

    // Extend the error with the properties of the original error and the `props` object
    return extendError(newError, originalError, props);
  }

  ono[Symbol.species] = ErrorConstructor;
  return ono;
}

/**
 * Returns an object containing all properties of the given Error object,
 * which can be used with `JSON.stringify()`.
 */
Ono.toJSON = function toJSON(error: ErrorLike) {
  return errorToJSON.call(error);
};

/**
 * Extends the given Error object with enhanced Ono functionality, such as nested stack traces,
 * additional properties, and improved support for `JSON.stringify()`.
 */
Ono.extend = function extend(error: ErrorLike, originalError?: ErrorLike, props?: object) {
  if (props || originalError instanceof Error) {
    return extendError(error, originalError, props);
  }
  else if (originalError) {
    return extendError(error, undefined, originalError);
  }
  else {
    return extendError(error);
  }
};
