"use strict";

require("@babel/polyfill/noConflict");
const { expect } = require("chai");
const { onoes } = require("../utils");

for (let { name, ono, errorTypeName } of onoes) {
  describe.skip(name + "().inspect", function () {

    it('should contain newlines instead of "\\n"', () => {
      function newError () {
        let originalError = new Error("Something went wrong");
        return ono(originalError, "Oh No!");
      }

      let err = newError();
      let string = err.inspect();

      expect(string).to.contain('"message": "Oh No! \nSomething went wrong"');  // <-- should contain newlines
      expect(string).not.to.contain("\\n");     // <-- should NOT contain escaped newlines
    });

    it("should return all built-in error properties", () => {
      function newError (message) {
        return ono("Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let string = err.inspect();

      expect(string).to.contain('\n  "name": "' + errorTypeName + '"');
      expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');

      if (err.stack) {
        expect(string).to.contain('\n  "stack": "');
      }
    });

    it("should return custom properties", () => {
      function newError (message) {
        return ono({ foo: "bar", biz: 5 }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let string = err.inspect();

      expect(string).to.contain('\n  "name": "' + errorTypeName + '"');
      expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(string).to.contain('\n  "foo": "bar"');
      expect(string).to.contain('\n  "biz": 5');

      if (err.stack) {
        expect(string).to.contain('\n  "stack": "');
      }
    });

    it("should return custom object properties", () => {
      let now = new Date();
      function newError (message) {
        return ono({ foo: "bar", biz: now }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let string = err.inspect();

      expect(string).to.contain('\n  "name": "' + errorTypeName + '"');
      expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(string).to.contain('\n  "foo": "bar"');
      expect(string).to.contain('\n  "biz": "' + now.toISOString() + '"');

      if (err.stack) {
        expect(string).to.contain('\n  "stack": "');
      }
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
      let string = err.inspect();

      expect(string).to.contain('\n  "name": "' + errorTypeName + '"');
      expect(string).to.contain('\n  "message": "Oh No! \nSomething went wrong"');
      expect(string).to.contain('\n  "foo": "xyz"');
      expect(string).to.contain('\n  "biz": 5');
      expect(string).to.contain('\n  "baz": "' + now.toISOString() + '"');
      expect(string).to.contain('\n  "bob": "abc"');

      if (err.stack) {
        expect(string).to.contain('\n  "stack": "');
      }
    });

    it("should NOT return undefined properties", () => {
      function newError (message) {
        return ono({ foo: "bar", biz: undefined }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let string = err.inspect();

      expect(string).to.contain('\n  "name": "' + errorTypeName + '"');
      expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(string).to.contain('\n  "foo": "bar"');

      if (err.stack) {
        expect(string).to.contain('\n  "stack": "');
      }
    });

    it("should NOT return function properties", () => {
      function noop () {}

      function newError (message) {
        return ono({ foo: "bar", biz: noop }, "Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let string = err.inspect();

      expect(string).to.contain('\n  "name": "' + errorTypeName + '"');
      expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(string).to.contain('\n  "foo": "bar"');

      if (err.stack) {
        expect(string).to.contain('\n  "stack": "');
      }
    });

    it(`should NOT include ${name} in the stack trace`, () => {
      function newError (message) {
        return ono("Oh No! %s", message);
      }

      let err = newError("Something went wrong");
      let string = err.inspect();

      expect(string).not.to.contain(` at ${name} `);  // Node, Chrome, Edge
      expect(string).not.to.contain(`${name}@`);      // Firefox

      if (err.stack) {
        expect(string).to.contain('\n  "stack": "');
      }
    });

  });
}
