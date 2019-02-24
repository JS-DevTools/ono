"use strict";

require("@babel/polyfill/noConflict");
const { ono, Ono } = require("../../");
const { expect } = require("chai");
const { host } = require("../utils");

describe("ono.formatter", function () {
  describe("default behavior", () => {

    it("should do nothing if no args are passed", () => {
      let err = ono("%s must be greater than %d");
      expect(err.message).to.equal("%s must be greater than %d");
    });

    it("should work with fewer args than placeholders", () => {
      let err = ono("%s must be greater than %d", 4);
      if (host.node) {
        expect(err.message).to.equal("4 must be greater than %d");
      }
      else {
        expect(err.message).to.equal("%s must be greater than %d 4");
      }
    });

    it("should work with more args than placeholders", () => {
      let err = ono("%s must be greater than %d", 4, 10, 20);
      if (host.node) {
        expect(err.message).to.equal("4 must be greater than 10 20");
      }
      else {
        expect(err.message).to.equal("%s must be greater than %d 4 10 20");
      }
    });

    it("should convert values to the appropriate string representations", () => {
      let obj = { foo: "bar" };
      let err = ono("String: %s, Number: %d, JSON: %j, Object: %o, Literal: %%", obj, obj, obj, obj, obj);
      if (host.node) {
        if (host.node.version > 7) {
          expect(err.message).to.equal(
            "String: [object Object], " +
            "Number: NaN, " +
            "JSON: {\"foo\":\"bar\"}, " +
            "Object: { foo: \'bar\' }, " +
            "Literal: % " +
            "{ foo: \'bar\' }"
          );
        }
        else {
          // Node <= 6
          expect(err.message).to.equal(
            "String: [object Object], " +
            "Number: NaN, " +
            "JSON: {\"foo\":\"bar\"}, " +
            "Object: %o, " +
            "Literal: % " +
            "{ foo: \'bar\' } { foo: \'bar\' }"
          );
        }
      }
      else {
        expect(err.message).to.equal(
          "String: %s, Number: %d, JSON: %j, Object: %o, Literal: %% " +
          "[object Object] [object Object] [object Object] [object Object] [object Object]"
        );
      }
    });

  });

  describe("custom formatter", () => {
    let originalFormatter;

    beforeEach(() => {
      originalFormatter = ono.formatter;

      // A simple formatter that replaces $0, $1, $2, etc. with the corresponding param
      ono.formatter = function (message) {
        let params = Array.prototype.slice.call(arguments, 1);
        return params.reduce(function (msg, param, index) {
          return msg.replace("$" + index, param);
        }, message);
      };
    });

    afterEach(() => {
      ono.formatter = originalFormatter;
    });

    it("should use a custom formatter", () => {
      let err = ono("$0 must be greater than $1", 4, 10);
      expect(err.message).to.equal("4 must be greater than 10");
    });

    it("should use a custom formatter for type-specific methods", () => {
      let err = ono.type("$0 must be greater than $1", 4, 10);
      expect(err.message).to.equal("4 must be greater than 10");
    });

    it("should use a custom formatter for custom Ono methods", () => {
      class MyCustomErrorClass extends Error {
        constructor () {
          super("This is my custom error message");
          this.name = "MyCustomErrorClass";
          this.code = 12345;
        }
      }

      let myCustomOno = new Ono(MyCustomErrorClass);
      let err = myCustomOno("$0 must be greater than $1", 4, 10);
      expect(err.message).to.equal("This is my custom error message");
    });

  });
});
