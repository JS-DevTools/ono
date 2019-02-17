helper.forEachMethod(function (name, ono, ErrorType, ErrorTypeName) {
  "use strict";

  // Errors in IE 11 and older do not include stack traces at all.
  // Safari stack traces have the script URL and line number, but no function name
  var STACK_TRACES_HAVE_FUNCTION_NAMES = !host.browser.safari && !(host.browser.IE && host.browser.IE.version < 12);

  // Node.js and Chrome both have V8 stack traces, which start with the error name and message
  var STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE = host.node || host.browser.chrome;

  var factoryName = ono.name || "onoFactory";

  describe(name, function () {

    it("can be called without any args",
      function () {
        function newErrorWithNoArgs () {
          return ono();
        }

        var err = newErrorWithNoArgs();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("");

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithNoArgs/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack
        }));
      }
    );

    it("can be called with just a message",
      function () {
        function newErrorWithMessage () {
          return ono("Onoes!!!");
        }

        var err = newErrorWithMessage();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("Onoes!!!");

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithMessage/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack
        }));
      }
    );

    it("can be called with a parameterized message",
      function () {
        function newErrorWithParams () {
          return ono("Testing %s, %d, %j", 1, "2", "3");
        }

        var err = newErrorWithParams();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing 1, 2, "3"');

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithParams/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack
        }));
      }
    );

    it("can be called with parameters, even if the message has no placeholders",
      function () {
        function newErrorWithNoPlaceholders () {
          return ono("Testing", 1, "2", "3");
        }

        var err = newErrorWithNoPlaceholders();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("Testing 1 2 3");

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithNoPlaceholders/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack
        }));
      }
    );

    it("can be called without parameters, even if the message has placeholders",
      function () {
        function newErrorWithNoParams () {
          return ono("Testing %s, %d, %j");
        }

        var err = newErrorWithNoParams();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("Testing %s, %d, %j");

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithNoParams/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack
        }));
      }
    );

    it("can be called with just an inner error",
      function () {
        function makeInnerError () {
          var innerError = new SyntaxError("This is the inner error");
          innerError.foo = "bar";
          innerError.code = 404;
          return innerError;
        }

        function newErrorWithInnerError (innerErr) {
          return ono(innerErr);
        }

        var err = newErrorWithInnerError(makeInnerError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("This is the inner error");
        expect(err.foo).to.equal("bar");
        expect(err.code).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithInnerError/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
          expect(err.stack).to.match(/SyntaxError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          foo: "bar",
          code: 404
        }));
      }
    );

    it("can be called with an inner error and a message",
      function () {
        function makeInnerError () {
          var innerError = new ReferenceError("This is the inner error");
          innerError.foo = "bar";
          innerError.code = 404;
          return innerError;
        }

        function newErrorWithInnerErrorAndMessage (innerErr) {
          return ono(innerErr, "Oops, an error happened.");
        }

        var err = newErrorWithInnerErrorAndMessage(makeInnerError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("Oops, an error happened. \nThis is the inner error");
        expect(err.foo).to.equal("bar");
        expect(err.code).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithInnerErrorAndMessage/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
          expect(err.stack).to.match(/ReferenceError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          foo: "bar",
          code: 404
        }));
      }
    );

    it("can be called with an inner error and a parameterized message",
      function () {
        function makeInnerError () {
          var innerError = new RangeError("This is the inner error");
          innerError.foo = "bar";
          innerError.code = 404;
          return innerError;
        }

        function newErrorWithInnerErrorAndParamMessage (innerErr) {
          return ono(innerErr, "Testing, %s, %d, %j", 1, "2", "3");
        }

        var err = newErrorWithInnerErrorAndParamMessage(makeInnerError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is the inner error');
        expect(err.foo).to.equal("bar");
        expect(err.code).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithInnerErrorAndParamMessage/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
          expect(err.stack).to.match(/RangeError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          foo: "bar",
          code: 404
        }));
      }
    );

    it("can be called with just a props object",
      function () {
        var now = new Date();

        function foo () {}

        function newErrorWithProps () {
          return ono({
            code: 404,
            text: "Not Found",
            timestamp: now,
            foo: foo
          });
        }

        var err = newErrorWithProps();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("");
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithProps/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON()
        }));
      }
    );

    it("can be called with an inner DOM error and a props object",
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function newErrorWithDOMErrorAndProps (domError) {
          return ono(domError, {
            code: 404,
            text: "Not Found",
            timestamp: now,
            someMethod: someMethod
          });
        }

        var err = newErrorWithDOMErrorAndProps(makeDOMError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("This is a DOM error");
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).not.to.match(/makeDOMError/);
            expect(err.stack).to.match(/newErrorWithDOMErrorAndProps/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON(),
        }));
      }
    );

    it("can be called with an inner error and a props object",
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function makeInnerError () {
          var innerError = new EvalError("This is the inner error");
          innerError.foo = "bar";
          innerError.code = 500;
          return innerError;
        }

        function newErrorWithInnerErrorAndProps (innerErr) {
          return ono(innerErr, {
            code: 404,
            text: "Not Found",
            timestamp: now,
            someMethod: someMethod
          });
        }

        var err = newErrorWithInnerErrorAndProps(makeInnerError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("This is the inner error");
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);
        expect(err.foo).to.equal("bar");
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/makeInnerError/);
            expect(err.stack).to.match(/newErrorWithInnerErrorAndProps/);
          }
        }

        if (STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
          expect(err.stack).to.match(/EvalError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON(),
          foo: "bar"
        }));
      }
    );

    it("can be called with a non-eror and a props object",
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function makeNonError () {
          return {
            code: "ERESET",
            name: "TypeError",
            message: "This looks like an error, but it's not one",
            stack: "at foo.js:15:27\n  at bar.js:86:12",
            foo: "bar",
          };
        }

        function newErrorWithNonErrorAndProps (nonError) {
          return ono(nonError, {
            code: 404,
            text: "Not Found",
            timestamp: now,
            someMethod: someMethod
          });
        }

        var err = newErrorWithNonErrorAndProps(makeNonError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("This looks like an error, but it's not one");
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);
        expect(err.foo).to.equal("bar");
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);
          expect(err.stack).to.match(/foo\.js/);
          expect(err.stack).to.match(/bar\.js/);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithNonErrorAndProps/);
          }
        }

        if (STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
          expect(err.stack).to.match(/Error: This looks like an error, but it's not one/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON(),
          foo: "bar"
        }));
      }
    );

    it("can be called with a props object and a message",
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function newErrorWithPropsAndMessage () {
          return ono({
            code: 404,
            text: "Not Found",
            timestamp: now,
            someMethod: someMethod
          }, "Onoes! Something bad happened.");
        }

        var err = newErrorWithPropsAndMessage();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal("Onoes! Something bad happened.");
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithPropsAndMessage/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON()
        }));
      });

    it("can be called with a props object and a parameterized message",
      function () {
        var now = new Date();

        function foo () {}

        function newErrorWithPropsAndParamMessage () {
          return ono({
            code: 404,
            text: "Not Found",
            timestamp: now,
            foo: foo
          }, "Testing, %s, %d, %j", 1, "2", "3");
        }

        var err = newErrorWithPropsAndParamMessage();

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3"');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithPropsAndParamMessage/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON()
        }));
      }
    );

    it("can be called with an inner error, props object, and a parameterized message",
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function makeInnerError () {
          var innerError = new EvalError("This is the inner error");
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
              someMethod: someMethod
            },
            "Testing, %s, %d, %j", 1, "2", "3"
          );
        }

        var err = newErrorWithInnerErrorPropsAndParamMessage(makeInnerError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is the inner error');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);
        expect(err.foo).to.equal("bar");
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithInnerErrorPropsAndParamMessage/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
          expect(err.stack).to.match(/EvalError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON(),
          foo: "bar"
        }));
      }
    );

    it("can be called with an inner DOM error, props object, and a parameterized message",
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function newErrorWithDOMErrorPropsAndParamMessage (domError) {
          return ono(
            domError,
            {
              code: 404,
              text: "Not Found",
              timestamp: now,
              someMethod: someMethod
            },
            "Testing, %s, %d, %j", 1, "2", "3"
          );
        }

        var err = newErrorWithDOMErrorPropsAndParamMessage(makeDOMError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is a DOM error');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).not.to.match(/makeDOMError/);
            expect(err.stack).to.match(/newErrorWithDOMErrorPropsAndParamMessage/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON(),
        }));
      }
    );

    it("can be called with a non-error, props object, and a parameterized message",
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function makeNonError () {
          return {
            code: "ERESET",
            name: "TypeError",
            message: "This looks like an error, but it's not one",
            stack: "at foo.js:15:27\n  at bar.js:86:12",
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
              someMethod: someMethod
            },
            "Testing, %s, %d, %j", 1, "2", "3"
          );
        }

        var err = newErrorWithNonErrorPropsAndParamMessage(makeNonError());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3" \nThis looks like an error, but it\'s not one');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal("Not Found");
        expect(err.timestamp).to.equal(now);
        expect(err.foo).to.equal("bar");
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);
          expect(err.stack).to.match(/foo\.js/);
          expect(err.stack).to.match(/bar\.js/);

          if (STACK_TRACES_HAVE_FUNCTION_NAMES) {
            expect(err.stack).to.match(/newErrorWithNonErrorPropsAndParamMessage/);
          }
        }

        if (STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE) {
          expect(err.stack).to.match(/Error: Testing, 1, 2, "3" \nThis looks like an error, but it's not one/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: "Not Found",
          timestamp: now.toJSON(),
          foo: "bar"
        }));
      }
    );

  });

