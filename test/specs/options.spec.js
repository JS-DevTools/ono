"use strict";

const { Ono } = require("../../");
const { expect } = require("chai");
const { host } = require("../utils");

describe("Ono options", () => {

  describe("concatMessages", () => {
    it("should concatenate error messages by default", () => {
      let myCustomOno = new Ono(SyntaxError);
      let originalError = new RangeError("Boom!");
      let newError = myCustomOno(originalError, "Error while saving file.");

      expect(newError.message).to.equal("Error while saving file. \nBoom!");

      if (host.error.stack) {
        expect(newError.stack).to.contain(originalError.stack);

        if (host.error.stack.includesErrorMessage) {
          expect(newError.stack).to.contain("SyntaxError: Error while saving file.");
          expect(newError.stack).to.contain("RangeError: Boom!");
        }
      }
    });

    it("should concatenate error messages if explicitly set to undefined", () => {
      let myCustomOno = new Ono(URIError, {
        concatMessages: undefined
      });

      let originalError = new SyntaxError("Boom!");
      let newError = myCustomOno(originalError, "Error while saving file.");

      expect(newError.message).to.equal("Error while saving file. \nBoom!");

      if (host.error.stack) {
        expect(newError.stack).to.contain(originalError.stack);

        if (host.error.stack.includesErrorMessage) {
          expect(newError.stack).to.contain("URIError: Error while saving file.");
          expect(newError.stack).to.contain("SyntaxError: Boom!");
        }
      }
    });

    it("should concatenate error messages if explicitly set to true", () => {
      let myCustomOno = new Ono(TypeError, {
        concatMessages: true
      });

      let originalError = new ReferenceError("Boom!");
      let newError = myCustomOno(originalError, "Error while saving file.");

      expect(newError.message).to.equal("Error while saving file. \nBoom!");

      if (host.error.stack) {
        expect(newError.stack).to.contain(originalError.stack);

        if (host.error.stack.includesErrorMessage) {
          expect(newError.stack).to.contain("TypeError: Error while saving file.");
          expect(newError.stack).to.contain("ReferenceError: Boom!");
        }
      }
    });

    it("should concatenate error messages if set to a truthy value", () => {
      let myCustomOno = new Ono(SyntaxError, {
        concatMessages: 45
      });

      let originalError = new URIError("Boom!");
      let newError = myCustomOno(originalError, "Error while saving file.");

      expect(newError.message).to.equal("Error while saving file. \nBoom!");

      if (host.error.stack) {
        expect(newError.stack).to.contain(originalError.stack);

        if (host.error.stack.includesErrorMessage) {
          expect(newError.stack).to.contain("SyntaxError: Error while saving file.");
          expect(newError.stack).to.contain("URIError: Boom!");
        }
      }
    });

    it("should not concatenate error messages if disabled", () => {
      let myCustomOno = new Ono(EvalError, {
        concatMessages: false
      });

      let originalError = new TypeError("Boom!");
      let newError = myCustomOno(originalError, "Error while saving file.");

      expect(newError.message).to.equal("Error while saving file.");

      if (host.error.stack) {
        expect(newError.stack).to.contain(originalError.stack);

        if (host.error.stack.includesErrorMessage) {
          expect(newError.stack).to.contain("EvalError: Error while saving file.");
          expect(newError.stack).to.contain("TypeError: Boom!");
        }
      }
    });

    it("should not concatenate error messages if set to a falsy value", () => {
      let myCustomOno = new Ono(ReferenceError, {
        concatMessages: ""
      });

      let originalError = new SyntaxError("Boom!");
      let newError = myCustomOno(originalError, "Error while saving file.");

      expect(newError.message).to.equal("Error while saving file.");

      if (host.error.stack) {
        expect(newError.stack).to.contain(originalError.stack);

        if (host.error.stack.includesErrorMessage) {
          expect(newError.stack).to.contain("ReferenceError: Error while saving file.");
          expect(newError.stack).to.contain("SyntaxError: Boom!");
        }
      }
    });

    it("should not concatenate error messages if set to null", () => {
      let myCustomOno = new Ono(Error, {
        concatMessages: null
      });

      let originalError = new URIError("Boom!");
      let newError = myCustomOno(originalError, "Error while saving file.");

      expect(newError.message).to.equal("Error while saving file.");

      if (host.error.stack) {
        expect(newError.stack).to.contain(originalError.stack);

        if (host.error.stack.includesErrorMessage) {
          expect(newError.stack).to.contain("Error: Error while saving file.");
          expect(newError.stack).to.contain("URIError: Boom!");
        }
      }
    });
  });

  describe("formatter", () => {
    it("should use the default formatter, depending on the host", () => {
      let myCustomOno = new Ono(SyntaxError);
      let err = myCustomOno("%s must be greater than %d", 4, 10);

      if (host.node) {
        expect(err.message).to.equal("4 must be greater than 10");
      }
      else {
        expect(err.message).to.equal("%s must be greater than %d 4 10");
      }
    });

    it("should use the default formatter if explicitly set to undefined", () => {
      let myCustomOno = new Ono(SyntaxError, {
        formatter: undefined,
      });

      let err = myCustomOno("%s must be greater than %d", 4, 10);

      if (host.node) {
        expect(err.message).to.equal("4 must be greater than 10");
      }
      else {
        expect(err.message).to.equal("%s must be greater than %d 4 10");
      }
    });

    it("should use a custom formatter", () => {
      // A simple formatter that replaces $0, $1, $2, etc. with the corresponding param
      function myCustomFormatter (message) {
        let params = Array.prototype.slice.call(arguments, 1);
        return params.reduce(function (msg, param, index) {
          return msg.replace("$" + index, param);
        }, message);
      }

      let myCustomOno = new Ono(SyntaxError, {
        formatter: myCustomFormatter
      });

      let err = myCustomOno("$0 must be greater than $1", 4, 10);
      expect(err.message).to.equal("4 must be greater than 10");
    });

    it("should not use a formatter if disabled", () => {
      let myCustomOno = new Ono(SyntaxError, {
        formatter: false
      });

      let err = myCustomOno("%s must be greater than %d", 4, 10);
      expect(err.message).to.equal("%s must be greater than %d 4 10");
    });

    it("should not use a formatter if set to a falsy value", () => {
      let myCustomOno = new Ono(SyntaxError, {
        formatter: ""
      });

      let err = myCustomOno("%s must be greater than %d", 4, 10);
      expect(err.message).to.equal("%s must be greater than %d 4 10");
    });

    it("should not use a formatter if set to null", () => {
      let myCustomOno = new Ono(SyntaxError, {
        formatter: null
      });

      let err = myCustomOno("%s must be greater than %d", 4, 10);
      expect(err.message).to.equal("%s must be greater than %d 4 10");
    });

    it("should not use a formatter if set to an invalid value", () => {
      let myCustomOno = new Ono(SyntaxError, {
        formatter: 42,
      });

      let err = myCustomOno("%s must be greater than %d", 4, 10);
      expect(err.message).to.equal("%s must be greater than %d 4 10");
    });
  });

});
