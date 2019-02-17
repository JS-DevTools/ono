"use strict";

const { expect } = require("chai");
const { onoes, createFakeStack, compareStacks, compareJSON, host, makeDOMError } = require("../utils");

for (let { name, ono, ErrorType, errorTypeName } of onoes) {
  describe(name, () => {

    it("can be called without any args", () => {
      function newErrorWithNoArgs () {
        return ono();
      }

      let err = newErrorWithNoArgs();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("");
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithNoArgs"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    });

    it("can be called with the `new` operator and no args", () => {
      function newErrorWithNoArgs () {
        return new ono();   // eslint-disable-line new-cap
      }

      let err = newErrorWithNoArgs();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("");
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithNoArgs"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    });

    it("can be called with the `new` operator with args", () => {
      function newErrorWithParams () {
        return new ono("Testing %s, %d, %j", 1, "2", "3");  // eslint-disable-line new-cap
      }

      let err = newErrorWithParams();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal('Testing 1, 2, "3"');
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithParams"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    });

    it("can be called with just a message", () => {
      function newErrorWithMessage () {
        return ono("Onoes!!!");
      }

      let err = newErrorWithMessage();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("Onoes!!!");
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithMessage"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    });

    it("can be called with a parameterized message", () => {
      function newErrorWithParams () {
        return ono("Testing %s, %d, %j", 1, "2", "3");
      }

      let err = newErrorWithParams();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal('Testing 1, 2, "3"');
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithParams"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    });

    it("can be called with parameters, even if the message has no placeholders", () => {
      function newErrorWithNoPlaceholders () {
        return ono("Testing", 1, "2", "3");
      }

      let err = newErrorWithNoPlaceholders();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("Testing 1 2 3");
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithNoPlaceholders"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    });

    it("can be called without parameters, even if the message has placeholders", () => {
      function newErrorWithNoParams () {
        return ono("Testing %s, %d, %j");
      }

      let err = newErrorWithNoParams();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("Testing %s, %d, %j");
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithNoParams"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    });

    it("can be called with just an inner error", () => {
      function makeInnerError () {
        let innerError = new SyntaxError("This is the inner error");
        innerError.foo = "bar";
        innerError.code = 404;
        return innerError;
      }

      function newErrorWithInnerError (innerErr) {
        return ono(innerErr);
      }

      let err = newErrorWithInnerError(makeInnerError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("This is the inner error");
      expect(err.foo).to.equal("bar");
      expect(err.code).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithInnerError"],
        ["makeInnerError"]
      ));

      if (host.STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
        expect(err.stack).to.match(/SyntaxError: This is the inner error/);
      }

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        foo: "bar",
        code: 404
      }));
    });

    it("can be called with an inner error and a message", () => {
      function makeInnerError () {
        let innerError = new ReferenceError("This is the inner error");
        innerError.foo = "bar";
        innerError.code = 404;
        return innerError;
      }

      function newErrorWithInnerErrorAndMessage (innerErr) {
        return ono(innerErr, "Oops, an error happened.");
      }

      let err = newErrorWithInnerErrorAndMessage(makeInnerError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("Oops, an error happened. \nThis is the inner error");
      expect(err.foo).to.equal("bar");
      expect(err.code).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithInnerErrorAndMessage"],
        ["makeInnerError"]
      ));

      if (host.STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
        expect(err.stack).to.match(/ReferenceError: This is the inner error/);
      }

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        foo: "bar",
        code: 404
      }));
    });

    it("can be called with an inner error and a parameterized message", () => {
      function makeInnerError () {
        let innerError = new RangeError("This is the inner error");
        innerError.foo = "bar";
        innerError.code = 404;
        return innerError;
      }

      function newErrorWithInnerErrorAndParamMessage (innerErr) {
        return ono(innerErr, "Testing, %s, %d, %j", 1, "2", "3");
      }

      let err = newErrorWithInnerErrorAndParamMessage(makeInnerError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is the inner error');
      expect(err.foo).to.equal("bar");
      expect(err.code).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithInnerErrorAndParamMessage"],
        ["makeInnerError"]
      ));

      if (host.STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
        expect(err.stack).to.match(/RangeError: This is the inner error/);
      }

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        foo: "bar",
        code: 404
      }));
    });

    it("can be called with just a props object", () => {
      let now = new Date();

      function foo () {}

      function newErrorWithProps () {
        return ono({
          code: 404,
          text: "Not Found",
          timestamp: now,
          foo
        });
      }

      let err = newErrorWithProps();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("");
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithProps"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON()
      }));
    });

    it("can be called with an inner DOM error and a props object", () => {
      let now = new Date();

      function someMethod () { return this.code; }

      function newErrorWithDOMErrorAndProps (domError) {
        return ono(domError, {
          code: 404,
          text: "Not Found",
          timestamp: now,
          someMethod
        });
      }

      let err = newErrorWithDOMErrorAndProps(makeDOMError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("This is a DOM error");
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.someMethod).to.equal(someMethod);
      expect(err.someMethod()).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithDOMErrorAndProps"],
        ["makeDOMError"]
      ));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON(),
      }));
    });

    it("can be called with an inner error and a props object", () => {
      let now = new Date();

      function someMethod () { return this.code; }

      function makeInnerError () {
        let innerError = new EvalError("This is the inner error");
        innerError.foo = "bar";
        innerError.code = 500;
        return innerError;
      }

      function newErrorWithInnerErrorAndProps (innerErr) {
        return ono(innerErr, {
          code: 404,
          text: "Not Found",
          timestamp: now,
          someMethod
        });
      }

      let err = newErrorWithInnerErrorAndProps(makeInnerError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("This is the inner error");
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.foo).to.equal("bar");
      expect(err.someMethod).to.equal(someMethod);
      expect(err.someMethod()).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithInnerErrorAndProps"],
        ["makeInnerError"]
      ));

      if (host.STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
        expect(err.stack).to.match(/EvalError: This is the inner error/);
      }

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON(),
        foo: "bar"
      }));
    });

    it("can be called with a non-eror and a props object", () => {
      let now = new Date();

      function someMethod () { return this.code; }

      function makeNonError () {
        return {
          code: "ERESET",
          name: "TypeError",
          message: "This looks like an error, but it's not one",
          stack: createFakeStack(
            { fn: "foo", file: "foo.js", line: 15, col: 27 },
            { fn: "bar", file: "bar.js", line: 86, col: 12 }
          ),
          foo: "bar",
        };
      }

      function newErrorWithNonErrorAndProps (nonError) {
        return ono(nonError, {
          code: 404,
          text: "Not Found",
          timestamp: now,
          someMethod
        });
      }

      let err = newErrorWithNonErrorAndProps(makeNonError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("This looks like an error, but it's not one");
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.foo).to.equal("bar");
      expect(err.someMethod).to.equal(someMethod);
      expect(err.someMethod()).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithNonErrorAndProps"],
        ["foo", "bar"]
      ));

      if (host.STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
        expect(err.stack).to.match(/Error: This looks like an error, but it's not one/);
      }

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON(),
        foo: "bar"
      }));
    });

    it("can be called with a props object and a message", () => {
      let now = new Date();

      function someMethod () { return this.code; }

      function newErrorWithPropsAndMessage () {
        return ono({
          code: 404,
          text: "Not Found",
          timestamp: now,
          someMethod
        }, "Onoes! Something bad happened.");
      }

      let err = newErrorWithPropsAndMessage();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal("Onoes! Something bad happened.");
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.someMethod).to.equal(someMethod);
      expect(err.someMethod()).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithPropsAndMessage"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON()
      }));
    });

    it("can be called with a props object and a parameterized message", () => {
      let now = new Date();

      function foo () {}

      function newErrorWithPropsAndParamMessage () {
        return ono({
          code: 404,
          text: "Not Found",
          timestamp: now,
          foo
        }, "Testing, %s, %d, %j", 1, "2", "3");
      }

      let err = newErrorWithPropsAndParamMessage();

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal('Testing, 1, 2, "3"');
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.stack).to.satisfy(compareStacks(["newErrorWithPropsAndParamMessage"]));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON()
      }));
    });

    it("can be called with an inner error, props object, and a parameterized message", () => {
      let now = new Date();

      function someMethod () { return this.code; }

      function makeInnerError () {
        let innerError = new EvalError("This is the inner error");
        innerError.foo = "bar";
        innerError.code = 500;
        return innerError;
      }

      function newErrorWithInnerErrorPropsAndParamMessage (innerErr) {
        return ono(
          innerErr,
          {
            code: 404,
            text: "Not Found",
            timestamp: now,
            someMethod
          },
          "Testing, %s, %d, %j", 1, "2", "3"
        );
      }

      let err = newErrorWithInnerErrorPropsAndParamMessage(makeInnerError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is the inner error');
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.foo).to.equal("bar");
      expect(err.someMethod).to.equal(someMethod);
      expect(err.someMethod()).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithInnerErrorPropsAndParamMessage"],
        ["makeInnerError"]
      ));

      if (host.STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
        expect(err.stack).to.match(/EvalError: This is the inner error/);
      }

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON(),
        foo: "bar"
      }));
    });

    it("can be called with an inner DOM error, props object, and a parameterized message", () => {
      let now = new Date();

      function someMethod () { return this.code; }

      function newErrorWithDOMErrorPropsAndParamMessage (domError) {
        return ono(
          domError,
          {
            code: 404,
            text: "Not Found",
            timestamp: now,
            someMethod
          },
          "Testing, %s, %d, %j", 1, "2", "3"
        );
      }

      let err = newErrorWithDOMErrorPropsAndParamMessage(makeDOMError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is a DOM error');
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.someMethod).to.equal(someMethod);
      expect(err.someMethod()).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithDOMErrorPropsAndParamMessage"],
        ["makeDOMError"]
      ));

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON(),
      }));
    });

    it("can be called with a non-error, props object, and a parameterized message", () => {
      let now = new Date();

      function someMethod () { return this.code; }

      function makeNonError () {
        return {
          code: "ERESET",
          name: "TypeError",
          message: "This looks like an error, but it's not one",
          stack: createFakeStack(
            { fn: "foo", file: "foo.js", line: 15, col: 27 },
            { fn: "bar", file: "bar.js", line: 86, col: 12 }
          ),
          foo: "bar",
        };
      }

      function newErrorWithNonErrorPropsAndParamMessage (nonError) {
        return ono(
          nonError,
          {
            code: 404,
            text: "Not Found",
            timestamp: now,
            someMethod
          },
          "Testing, %s, %d, %j", 1, "2", "3"
        );
      }

      let err = newErrorWithNonErrorPropsAndParamMessage(makeNonError());

      expect(err).to.be.an.instanceOf(ErrorType);
      expect(err.name).to.equal(errorTypeName);
      expect(err.message).to.equal('Testing, 1, 2, "3" \nThis looks like an error, but it\'s not one');
      expect(err.code).to.equal(404);
      expect(err.text).to.equal("Not Found");
      expect(err.timestamp).to.equal(now);
      expect(err.foo).to.equal("bar");
      expect(err.someMethod).to.equal(someMethod);
      expect(err.someMethod()).to.equal(404);
      expect(err.stack).to.satisfy(compareStacks(
        ["newErrorWithNonErrorPropsAndParamMessage"],
        ["foo", "bar"]
      ));

      if (host.STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
        expect(err.stack).to.match(/Error: Testing, 1, 2, "3" \nThis looks like an error, but it's not one/);
      }

      let json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(compareJSON({
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: 404,
        text: "Not Found",
        timestamp: now.toJSON(),
        foo: "bar"
      }));
    });
  });
}
