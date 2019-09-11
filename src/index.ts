import { formatter } from "./isomorphic.node";
import { Ono, ono } from "./ono";
import { toJSON as _toJSON } from "./to-json";
import { ErrorLike, ErrorPOJO } from "./types";

// Create Ono instances for each of the JavaScript error types
ono.error = new Ono(Error);
ono.eval = new Ono(EvalError);
ono.range = new Ono(RangeError);
ono.reference = new Ono(ReferenceError);
ono.syntax = new Ono(SyntaxError);
ono.type = new Ono(TypeError);
ono.uri = new Ono(URIError);

// Default to Node's `util.format()` functionality, but allow users to substitute their own
ono.formatter = formatter;

/**
 * Returns an object containing all properties of the given Error object,
 * which can be used with `JSON.stringify()`.
 */
Ono.toJSON = function toJSON<E extends ErrorLike>(error: E) {
  return _toJSON.call(error) as ErrorPOJO & E;
};

// Export type definitions
export * from "./types";
// Export the Ono singleton and the Ono constructor as named exports
export { ono, Ono };


// tslint:disable-next-line: no-default-export
export default ono;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);  // tslint:disable-line: no-unsafe-any
}
