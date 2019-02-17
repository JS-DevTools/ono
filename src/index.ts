import format from "format-util";
import { onoConstructor, onoSingleton } from "./ono";
import { OnoConstructor, OnoSingleton } from "./types";

// tslint:disable-next-line: variable-name
const Ono = onoConstructor as OnoConstructor;
const ono = onoSingleton as OnoSingleton;

// Create Ono instances for each of the JavaScript error types
ono.error = onoConstructor(Error);
ono.eval = onoConstructor(EvalError);
ono.range = onoConstructor(RangeError);
ono.reference = onoConstructor(ReferenceError);
ono.syntax = onoConstructor(SyntaxError);
ono.type = onoConstructor(TypeError);
ono.uri = onoConstructor(URIError);

// Default to Node's `util.format()` functionality, but allow users to substitute their own
ono.formatter = format;

// Export type definitions
export * from "./types";

// Export the Ono singleton and the Ono constructor as named exports
export { ono, Ono };

// tslint:disable-next-line: no-default-export
export default ono;

// CommonJS default export hack
// tslint:disable: no-unsafe-any
if (typeof module === "object" && typeof exports === "object") {
  module.exports = exports.default;
  Object.assign(module.exports, exports);
}
