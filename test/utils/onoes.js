"use strict";

const { ono } = require("../../");

module.exports = [
  { name: "ono", ono },
  { name: "ono.error", ono: ono.error, ErrorType: Error, errorTypeName: "Error" },
  { name: "ono.eval", ono: ono.eval, ErrorType: EvalError, errorTypeName: "EvalError" },
  { name: "ono.range", ono: ono.range, ErrorType: RangeError, errorTypeName: "RangeError" },
  { name: "ono.reference", ono: ono.reference, ErrorType: ReferenceError, errorTypeName: "ReferenceError" },
  { name: "ono.syntax", ono: ono.syntax, ErrorType: SyntaxError, errorTypeName: "SyntaxError" },
  { name: "ono.type", ono: ono.type, ErrorType: TypeError, errorTypeName: "TypeError" },
  { name: "ono.uri", ono: ono.uri, ErrorType: URIError, errorTypeName: "URIError" },
];
