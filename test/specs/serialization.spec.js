"use strict";

require("@babel/polyfill/noConflict");
const { expect } = require("chai");
const { onoes, compareJSON, compareStacks } = require("../utils");

for (let { name, ono, errorTypeName } of onoes) {
  describe(`${name} serialization`, () => {

    it("should return all built-in error properties", () => {
      function newError (message) {
        return ono("Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      expect(json).to.satisfy(compareJSON({
        name: errorTypeName,
        message: "Oh No! Something went wrong",
        stack: err.stack
      }));
    });

    it("should return custom properties", () => {
      function newError (message) {
        return ono({ foo: "bar", biz: 5 }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      expect(json).to.satisfy(compareJSON({
        name: errorTypeName,
        message: "Oh No! Something went wrong",
        stack: err.stack,
        foo: "bar",
        biz: 5
      }));
    });

    it("should return object properties", () => {
      let now = new Date();
      let regex = /xyz/;

      function newError (message) {
        return ono({ now, regex }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      expect(json).to.satisfy(compareJSON({
        name: errorTypeName,
        message: "Oh No! Something went wrong",
        stack: err.stack,
        now,
        regex,
      }));
    });

    it("should return inherited properties", () => {
      let now = new Date();
      function newError (message) {
        let originalError = new Error(message);
        originalError.foo = "bar";
        originalError.biz = 5;
        originalError.baz = now;

        return ono(originalError, { foo: "xyz", bob: "abc" }, "Oh No!");
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      expect(json).to.satisfy(compareJSON({
        name: errorTypeName,
        message: "Oh No! \nSomething went wrong",
        stack: err.stack,
        foo: "xyz",
        biz: 5,
        baz: now,
        bob: "abc"
      }));
    });

    it("should NOT return undefined properties", () => {
      function newError (message) {
        return ono({ foo: "bar", biz: undefined }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      expect(json).to.satisfy(compareJSON({
        name: errorTypeName,
        message: "Oh No! Something went wrong",
        stack: err.stack,
        foo: "bar"
      }));
    });

    it("should NOT return function properties", () => {
      function noop () {}

      function newError (message) {
        return ono({ foo: "bar", biz: noop }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      expect(json).to.satisfy(compareJSON({
        name: errorTypeName,
        message: "Oh No! Something went wrong",
        stack: err.stack,
        foo: "bar"
      }));
    });

    it("should NOT return symbol properties", () => {
      let symbol = Symbol();

      function newError (message) {
        return ono({ foo: symbol, [symbol]: "bar" }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      expect(json).to.satisfy(compareJSON({
        name: errorTypeName,
        message: "Oh No! Something went wrong",
        stack: err.stack,
      }));
    });

    it(`should NOT include ${name} in the stack trace`, () => {
      function newError (message) {
        return ono("Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let json = err.toJSON();

      if (json.stack) {
        expect(json.stack).to.satisfy(compareStacks(["newError"]));
      }
    });

  });
}
