"use strict";

require("@babel/polyfill/noConflict");
const { expect } = require("chai");
const { onoes, comparePOJO, host } = require("../utils");

// https://nodejs.org/api/util.html#util_util_inspect_custom
const inspect = (() => {
  if (host.node.version >= 10.12) {
    // The well-known symbol was added in Node v10.12
    return Symbol.for("nodejs.util.inspect.custom");
  }
  else if (host.node) {
    // Older versions of Node only exposed the symbal via util.inspect.custom
    return require("util").inspect.custom;
  }
})();

for (let { name, ono, errorTypeName } of onoes) {
  describe(`${name} serialization`, () => {

    it("should only have an inspect() method in Node", () => {
      let err = ono("Something went wrong");
      expect(err).to.have.property("toJSON").that.is.a("function").with.property("name", "toJSON");

      if (host.node) {
        expect(err[inspect]).to.be.a("function").with.property("name", "inspect");
      }
      else {
        expect(err[inspect]).to.be.undefined;
      }

      // The inpsect() method is actually a Symbol, _not_ the word "inspect"
      expect(err).not.to.have.property("inspect");
      expect(err.inspect).to.be.undefined;
    });

    it("should return all built-in error properties", () => {
      let err = ono("Something went wrong");

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Something went wrong",
        stack: err.stack
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Something went wrong",
          stack: err.stack,
          toJSON: err.toJSON,
          toString: err.toString,
        }));
      }
    });

    it("should return custom properties", () => {
      let err = ono({ foo: "bar", biz: 5 }, "Oh No! %s", "Something went wrong");

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Oh No! Something went wrong",
        stack: err.stack,
        foo: "bar",
        biz: 5
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Oh No! Something went wrong",
          stack: err.stack,
          foo: "bar",
          biz: 5,
          toJSON: err.toJSON,
          toString: err.toString,
        }));
      }
    });

    it("should return object properties", () => {
      let obj = { foo: "bar" };
      let date = new Date();
      let regex = /xyz/;
      let err = ono({ obj, date, regex }, "Something went wrong");

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Something went wrong",
        stack: err.stack,
        obj,
        date,
        regex,
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Something went wrong",
          stack: err.stack,
          obj,
          date,
          regex,
          toJSON: err.toJSON,
          toString: err.toString,
        }));
      }
    });

    it("should return properties of the original error", () => {
      let originalError = new Error("Something went wrong");
      originalError.foo = "bar";
      originalError.biz = 5;
      originalError.baz = { hello: "world" };

      let err = ono(originalError, "Oh No!");

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Oh No! \nSomething went wrong",
        stack: err.stack,
        foo: "bar",
        biz: 5,
        baz: { hello: "world" },
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Oh No! \nSomething went wrong",
          stack: err.stack,
          foo: "bar",
          biz: 5,
          baz: { hello: "world" },
          toJSON: err.toJSON,
          toString: err.toString,
        }));
      }
    });

    it("should merge the original error props and dynamic props", () => {
      let originalError = new Error("Something went wrong");
      originalError.foo = "bar";
      originalError.biz = 5;
      originalError.baz = { hello: "world" };

      let err = ono(originalError, { foo: "xyz", bob: "abc" }, "Oh No!");

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Oh No! \nSomething went wrong",
        stack: err.stack,
        foo: "xyz",
        biz: 5,
        baz: { hello: "world" },
        bob: "abc",
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Oh No! \nSomething went wrong",
          stack: err.stack,
          foo: "xyz",
          biz: 5,
          baz: { hello: "world" },
          bob: "abc",
          toJSON: err.toJSON,
          toString: err.toString,
        }));
      }
    });

    it("should properly handle falsy properties", () => {
      let err = ono({ foo: false, bar: undefined, baz: null }, "Something went wrong");

      expect(err).to.have.property("foo", false);
      expect(err).to.have.property("bar", undefined);
      expect(err).to.have.property("baz", null);

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Something went wrong",
        stack: err.stack,
        foo: false,
        baz: null,
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Something went wrong",
          stack: err.stack,
          foo: false,
          bar: undefined,
          baz: null,
          toJSON: err.toJSON,
          toString: err.toString,
        }));
      }
    });

    it("should properly handle function properties", () => {
      function foo () {}
      function toString () {}
      let err = ono({ foo, toString }, "Something went wrong");

      expect(err).to.have.property("foo", foo);
      expect(err).to.have.property("toString", toString);

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Something went wrong",
        stack: err.stack,
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Something went wrong",
          stack: err.stack,
          foo,
          toString,
          toJSON: err.toJSON,
        }));
      }
    });

    it("should properly handle symbol properties", () => {
      let symbolKey = Symbol("key");
      let symbolValue = Symbol("value");
      let err = ono({ foo: symbolValue, [symbolKey]: "bar" }, "Something went wrong");

      expect(err).to.have.property("foo", symbolValue);
      expect(err).to.have.property(symbolKey, "bar");

      expect(err.toJSON()).to.satisfy(comparePOJO({
        name: errorTypeName,
        message: "Something went wrong",
        stack: err.stack,
      }));

      if (host.node) {
        expect(err[inspect]()).to.satisfy(comparePOJO({
          name: errorTypeName,
          message: "Something went wrong",
          stack: err.stack,
          foo: symbolValue,
          [symbolKey]: "bar",
          toJSON: err.toJSON,
          toString: err.toString,
        }));
      }
    });

  });
}
