"use strict";

const { Ono } = require("../../");
const { expect } = require("chai");
const { comparePOJO } = require("../utils");

describe("Ono.toJSON()", () => {

  it("should return all built-in error properties", () => {
    let err = new TypeError("Something went wrong");

    expect(Ono.toJSON(err)).to.satisfy(comparePOJO({
      name: "TypeError",
      message: "Something went wrong",
      stack: err.stack
    }));
  });

  it("should return custom properties", () => {
    let err = new SyntaxError("Something went wrong");
    err.foo = "bar";
    err.biz = 5;

    expect(Ono.toJSON(err)).to.satisfy(comparePOJO({
      name: "SyntaxError",
      message: "Something went wrong",
      stack: err.stack,
      foo: "bar",
      biz: 5
    }));
  });

  it("should return object properties", () => {
    let obj = { foo: "bar" };
    let date = new Date();
    let regex = /xyz/;

    let err = new Error("Something went wrong");
    Object.assign(err, { obj, date, regex });

    expect(Ono.toJSON(err)).to.satisfy(comparePOJO({
      name: "Error",
      message: "Something went wrong",
      stack: err.stack,
      obj,
      date,
      regex,
    }));
  });

});
