import { extendError } from "./extend-error";
import { ErrorLike, ErrorLikeConstructor, Ono, OnoError, OnoSingleton } from "./ono";

/**
 * The singleton `Ono` instance.  This is the default export of the "ono" package.
 */
export const onoSingleton = onoFactory(Error) as OnoSingleton;

/**
 * A factory function that returns an `Ono` instance for a specifc error type.
 */
export function onoFactory<T extends ErrorLike>(klass: ErrorLikeConstructor<T>): Ono<T> {
  // tslint:disable-next-line: no-shadowed-variable
  return function ono(...args: Array<unknown>) {
    let originalError: ErrorLike | undefined;
    let props: object | undefined;
    let formatArgs: Array<unknown> | undefined;
    let formattedMessage = "";

    // Determine which arguments were actually specified
    if (typeof args[0] === "string") {
      formatArgs = args;
    }
    else if (typeof args[1] === "string") {
      originalError = args[0] as ErrorLike;
      formatArgs = args.slice(1);
    }
    else if (typeof args[2] === "string") {
      originalError = args[0] as ErrorLike;
      props = args[1] as object;
      formatArgs = args.slice(2);
    }

    // If there are any format arguments, then format the error message
    if (formatArgs && formatArgs.length > 0) {
      formattedMessage = onoSingleton.formatter.apply(undefined, formatArgs);
    }

    if (originalError && originalError.message) {
      // The inner-error's message will be added to the new message
      formattedMessage += (formattedMessage ? " \n" : "") + originalError.message;
    }

    // @ts-ignore
    // Create the new error
    // NOTE: DON'T move this line to a separate function! We don't want to pollute the stack trace
    let newError = new klass(formattedMessage) as T & OnoError;

    // Extend the error with the properties of the original error and the `props` object
    extendError(newError, originalError, props);

    return newError;
  };
}
