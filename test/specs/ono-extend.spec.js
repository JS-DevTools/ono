"use strict";

const { Ono } = require("../../");
const { assert, expect } = require("chai");
const { compareKeys, comparePOJO, compareStacks, host } = require("../utils");

// https://nodejs.org/api/util.html#util_util_inspect_custom
const inspect = Symbol.for("nodejs.util.inspect.custom");

describe("Ono.extend()", () => {

  it("should enhance an error object with Ono functionality", () => {
    function createRangeError () {
      return new RangeError("Something went wrong");
    }

    let error = createRangeError();
    let onoError = Ono.extend(error);

    expect(onoError).to.equal(error);
    expect(onoError.name).to.equal("RangeError");
    expect(onoError.message).to.equal("Something went wrong");
    expect(onoError.stack).to.satisfy(compareStacks(["createRangeError"]));
    expect(onoError).to.satisfy(compareKeys("name", "message", "stack", "toJSON"));

    expect(onoError.toJSON()).to.satisfy(comparePOJO({
      name: "RangeError",
      message: "Something went wrong",
      stack: error.stack
    }));

    if (host.node) {
      expect(onoError[inspect]()).to.satisfy(comparePOJO({
        name: "RangeError",
        message: "Something went wrong",
        stack: error.stack,
        toJSON: error.toJSON,
        toString: error.toString,
      }));
    }
  });

  it("should include the stack trace of the original error", () => {
    function createOriginalError () {
      return new RangeError("Bad range");
    }

    function createNewError () {
      return new SyntaxError("Invalid syntax");
    }

    let originalError = createOriginalError();
    let newError = createNewError();
    let onoError = Ono.extend(newError, originalError);

    expect(onoError).to.equal(newError);
    expect(onoError.name).to.equal("SyntaxError");
    expect(onoError.message).to.equal("Invalid syntax");
    expect(onoError.stack).to.satisfy(compareStacks(
      ["createNewError"],
      ["createOriginalError"],
    ));
    expect(onoError).to.satisfy(compareKeys("name", "message", "stack", "toJSON"));

    expect(onoError.toJSON()).to.satisfy(comparePOJO({
      name: "SyntaxError",
      message: "Invalid syntax",
      stack: newError.stack
    }));

    if (host.node) {
      expect(onoError[inspect]()).to.satisfy(comparePOJO({
        name: "SyntaxError",
        message: "Invalid syntax",
        stack: newError.stack,
        toJSON: newError.toJSON,
        toString: newError.toString,
      }));
    }
  });

  it("should add custom props", () => {
    function createTypeError () {
      return new TypeError("The type is all wrong");
    }

    let error = createTypeError();
    let onoError = Ono.extend(error, {
      foo: "bar",
      timestamp: new Date("2005-05-05T05:05:05.005Z")
    });

    expect(onoError).to.equal(error);
    expect(onoError.name).to.equal("TypeError");
    expect(onoError.message).to.equal("The type is all wrong");
    expect(onoError.stack).to.satisfy(compareStacks(["createTypeError"]));
    expect(onoError).to.satisfy(compareKeys("name", "message", "stack", "toJSON", "foo", "timestamp"));

    expect(onoError.toJSON()).to.satisfy(comparePOJO({
      name: "TypeError",
      message: "The type is all wrong",
      stack: error.stack,
      foo: "bar",
      timestamp: new Date("2005-05-05T05:05:05.005Z"),
    }));

    if (host.node) {
      expect(onoError[inspect]()).to.satisfy(comparePOJO({
        name: "TypeError",
        message: "The type is all wrong",
        stack: error.stack,
        toJSON: error.toJSON,
        toString: error.toString,
        foo: "bar",
        timestamp: new Date("2005-05-05T05:05:05.005Z"),
      }));
    }
  });

  it("should include custom props and the stack trace of the original error", () => {
    function createOriginalError () {
      return new RangeError("Bad range");
    }

    function createNewError () {
      return new SyntaxError("Invalid syntax");
    }

    let originalError = createOriginalError();
    let newError = createNewError();
    let onoError = Ono.extend(newError, originalError, {
      foo: "bar",
      timestamp: new Date("2005-05-05T05:05:05.005Z")
    });

    expect(onoError).to.equal(newError);
    expect(onoError.name).to.equal("SyntaxError");
    expect(onoError.message).to.equal("Invalid syntax");
    expect(onoError.stack).to.satisfy(compareStacks(
      ["createNewError"],
      ["createOriginalError"],
    ));
    expect(onoError).to.satisfy(compareKeys("name", "message", "stack", "toJSON", "foo", "timestamp"));

    expect(onoError.toJSON()).to.satisfy(comparePOJO({
      name: "SyntaxError",
      message: "Invalid syntax",
      stack: newError.stack,
      foo: "bar",
      timestamp: new Date("2005-05-05T05:05:05.005Z"),
    }));

    if (host.node) {
      expect(onoError[inspect]()).to.satisfy(comparePOJO({
        name: "SyntaxError",
        message: "Invalid syntax",
        stack: newError.stack,
        toJSON: newError.toJSON,
        toString: newError.toString,
        foo: "bar",
        timestamp: new Date("2005-05-05T05:05:05.005Z"),
      }));
    }
  });

  it("should throw an error if called without arguments", () => {
    try {
      Ono.extend();
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      expect(error).to.be.an.instanceOf(TypeError);
      expect(error.message).to.include("undefined");
    }
  });

  it("should throw an error if called with null", () => {
    try {
      Ono.extend(null);
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      expect(error).to.be.an.instanceOf(TypeError);
      expect(error.message).to.include("null");
    }
  });

});
