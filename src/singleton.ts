
import { Ono as OnoConstructor } from "./constructor";
import { ErrorLike, Ono, OnoSingleton } from "./types";

const singleton = ono as OnoSingleton;
export { singleton as ono };

ono.error = new OnoConstructor(Error);
ono.eval = new OnoConstructor(EvalError);
ono.range = new OnoConstructor(RangeError);
ono.reference = new OnoConstructor(ReferenceError);
ono.syntax = new OnoConstructor(SyntaxError);
ono.type = new OnoConstructor(TypeError);
ono.uri = new OnoConstructor(URIError);

const onoMap = ono as unknown as Record<string, Ono<Error>>;

/**
 * Creates a new error with the specified message, properties, and/or inner error.
 * If an inner error is provided, then the new error will match its type, if possible.
 */
function ono<TError extends ErrorLike, TProps extends object>(...args: unknown[]) {
  let originalError = args[0] as ErrorLike | undefined;

  // Is the first argument an Error-like object?
  if (typeof originalError === "object" && typeof originalError.name === "string") {

    // Try to find an Ono singleton method that matches this error type
    for (let typedOno of Object.values(onoMap)) {
      if (typeof typedOno === "function" && typedOno.name === "ono") {
        let species = typedOno[Symbol.species];

        if (species && species !== Error && (originalError instanceof species || originalError.name === species.name)) {
          // Create an error of the same type
          return typedOno.apply(undefined, args);
        }
      }
    }
  }

  // By default, create a base Error object
  return ono.error.apply(undefined, args);
}
