"use strict";

const { ono, Ono } = require("../../");
const { expect } = require("chai");
const { host } = require("../utils");

describe("Error message formatter", () => {

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
      if (host.node.version >= 12) {
        expect(err.message).to.equal(
          "String: { foo: 'bar' }, " +
          "Number: NaN, " +
          "JSON: {\"foo\":\"bar\"}, " +
          "Object: { foo: \'bar\' }, " +
          "Literal: % " +
          "{ foo: \'bar\' }"
        );
      }
      else if (host.node.version > 7) {
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

  it("should use a custom formatter", () => {
    // A simple formatter that replaces $0, $1, $2, etc. with the corresponding param
    function myCustomFormatter (message) {
      let params = Array.prototype.slice.call(arguments, 1);
      return params.reduce((msg, param, index) => msg.replace("$" + index, param), message);
    }

    let myCustomOno = new Ono(SyntaxError, { format: myCustomFormatter });
    let err = myCustomOno("$0 must be greater than $1", 4, 10);
    expect(err.message).to.equal("4 must be greater than 10");
  });

});
