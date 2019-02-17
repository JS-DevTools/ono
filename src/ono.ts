import { extendError } from "./extend-error";
import { ErrorLike, ErrorLikeConstructor, Ono, OnoConstructor, OnoError, OnoSingleton } from "./types";

const onoConstructor = Ono as OnoConstructor;
const onoSingleton = Ono(Error) as OnoSingleton;

export {
  onoConstructor as Ono,
  onoSingleton as ono,
};

/**
 * Creates an `Ono` instance for a specifc error type.
 */
function Ono<T extends ErrorLike>(klass: ErrorLikeConstructor<T>): Ono<T> {
  // tslint:disable-next-line: no-shadowed-variable
  return function ono<E extends ErrorLike, P extends object>(...args: Array<unknown>): T & E & P & OnoError {
    let originalError: E | undefined;
    let props: P | undefined;
    let formatArgs: Array<unknown> | undefined;
    let formattedMessage = "";

    // Determine which arguments were actually specified
    if (typeof args[0] === "string") {
      formatArgs = args;
    }
    else if (typeof args[1] === "string") {
      originalError = args[0] as E;
      formatArgs = args.slice(1);
    }
    else if (typeof args[2] === "string") {
      originalError = args[0] as E;
      props = args[1] as P;
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
    let newError = new klass(formattedMessage) as T & E & P & OnoError;

    // Extend the error with the properties of the original error and the `props` object
    extendError(newError, originalError, props);

    return newError;
  };
}
