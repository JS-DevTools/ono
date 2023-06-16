/* eslint-env commonjs */
import { ono } from "./singleton";

export { Ono } from "./constructor";
export * from "./types";
export { ono };

export default ono;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object" && typeof module.exports.default == "object") {
  module.exports = Object.assign(module.exports.default, module.exports);
}
