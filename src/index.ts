import format from "format-util";
import { onoFactory, onoSingleton } from "./ono-factory";

// external alias
const ono = onoSingleton;

// Create Ono instances for each of the JavaScript error types
ono.error = onoFactory(Error);
ono.eval = onoFactory(EvalError);
ono.range = onoFactory(RangeError);
ono.reference = onoFactory(ReferenceError);
ono.syntax = onoFactory(SyntaxError);
ono.type = onoFactory(TypeError);
ono.uri = onoFactory(URIError);
ono.formatter = format;

// Export the Ono singleton as the default export and a named export
// tslint:disable-next-line: no-default-export
export default ono;
export { ono };

// Also export the Ono factory function,
// so users can create their own Ono instances for custom error types
export { onoFactory as Ono };

// CommonJS default export hack
// tslint:disable: no-unsafe-any
if (typeof module === "object" && typeof exports === "object") {
  module.exports = exports.default;
  Object.assign(module.exports, exports);
}
