import { formatter } from "./isomorphic.node";
import { Ono, ono } from "./ono";

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
