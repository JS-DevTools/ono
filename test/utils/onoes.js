"use strict";

const { ono } = require("../../");

module.exports = [
  { name: "ono", ono, ErrorType: Error, errorTypeName: "Error" },
  { name: "ono.error", ono: ono.error, ErrorType: Error, errorTypeName: "Error" },
  { name: "ono.error", ono: ono.eval, ErrorType: EvalError, errorTypeName: "EvalError" },
  { name: "ono.error", ono: ono.range, ErrorType: RangeError, errorTypeName: "RangeError" },
  { name: "ono.error", ono: ono.reference, ErrorType: ReferenceError, errorTypeName: "ReferenceError" },
  { name: "ono.error", ono: ono.syntax, ErrorType: SyntaxError, errorTypeName: "SyntaxError" },
  { name: "ono.error", ono: ono.type, ErrorType: TypeError, errorTypeName: "TypeError" },
  { name: "ono.error", ono: ono.uri, ErrorType: URIError, errorTypeName: "URIError" },
];
