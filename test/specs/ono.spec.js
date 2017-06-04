helper.forEachMethod(function (name, ono, ErrorType, ErrorTypeName) {
  'use strict';

  var factoryName = ono.name || 'onoFactory';

  describe(name, function () {

    it('can be called without any args',
      function () {
        var err = (function newErrorWithNoArgs () {
          return ono();
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('');

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
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

    it('can be called with just a message',
      function () {
        var err = (function newErrorWithMessage () {
          return ono('Onoes!!!');
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Onoes!!!');

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
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

    it('can be called with a parameterized message',
      function () {
        var err = (function newErrorWithParams () {
          return ono('Testing %s, %d, %j', 1, '2', '3');
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing 1, 2, "3"');

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
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

    it('can be called with parameters, even if the message has no placeholders',
      function () {
        var err = (function newErrorWithNoPlaceholders () {
          return ono('Testing', 1, '2', '3');
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing 1 2 3');

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
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

    it('can be called without parameters, even if the message has placeholders',
      function () {
        var err = (function newErrorWithNoParams () {
          return ono('Testing %s, %d, %j');
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing %s, %d, %j');

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
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

    it('can be called with just an inner-error',
      function () {
        function makeInnerError () {
          var err = new SyntaxError('This is the inner error');
          err.foo = 'bar';
          err.code = 404;
          return err;
        }

        var err = (function newErrorWithInnerError (innerErr) {
          return ono(innerErr);
        }(makeInnerError()));

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('This is the inner error');
        expect(err.foo).to.equal('bar');
        expect(err.code).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/newErrorWithInnerError/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (host.browser.chrome) {
          expect(err.stack).to.match(/SyntaxError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          foo: 'bar',
          code: 404
        }));
      }
    );

    it('can be called with an inner-error and a message',
      function () {
        function makeInnerError () {
          var err = new ReferenceError('This is the inner error');
          err.foo = 'bar';
          err.code = 404;
          return err;
        }

        var err = (function newErrorWithInnerErrorAndMessage (innerErr) {
          return ono(innerErr, 'Oops, an error happened.');
        }(makeInnerError()));

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Oops, an error happened. \nThis is the inner error');
        expect(err.foo).to.equal('bar');
        expect(err.code).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/newErrorWithInnerErrorAndMessage/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (host.browser.chrome) {
          expect(err.stack).to.match(/ReferenceError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          foo: 'bar',
          code: 404
        }));
      }
    );

    it('can be called with an inner-error and a parameterized message',
      function () {
        function makeInnerError () {
          var err = new RangeError('This is the inner error');
          err.foo = 'bar';
          err.code = 404;
          return err;
        }

        var err = (function newErrorWithInnerErrorAndParamMessage (innerErr) {
          return ono(innerErr, 'Testing, %s, %d, %j', 1, '2', '3');
        }(makeInnerError()));

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is the inner error');
        expect(err.foo).to.equal('bar');
        expect(err.code).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/newErrorWithInnerErrorAndParamMessage/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (host.browser.chrome) {
          expect(err.stack).to.match(/RangeError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          foo: 'bar',
          code: 404
        }));
      }
    );

    it('can be called with just a props object',
      function () {
        var now = new Date();

        function foo () {}

        var err = (function newErrorWithProps () {
          return ono({
            code: 404,
            text: 'Not Found',
            timestamp: now,
            foo: foo
          });
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal('Not Found');
        expect(err.timestamp).to.equal(now);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/newErrorWithProps/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: 'Not Found',
          timestamp: now.toJSON()
        }));
      }
    );

    it('can be called with an inner-error and a props object',
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function makeInnerError () {
          var err = new EvalError('This is the inner error');
          err.foo = 'bar';
          err.code = 500;
          return err;
        }

        var err = (function newErrorWithInnerErrorAndProps (innerErr) {
          return ono(innerErr, {
            code: 404,
            text: 'Not Found',
            timestamp: now,
            someMethod: someMethod
          });
        }(makeInnerError()));

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('This is the inner error');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal('Not Found');
        expect(err.timestamp).to.equal(now);
        expect(err.foo).to.equal('bar');
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/makeInnerError/);
            expect(err.stack).to.match(/newErrorWithInnerErrorAndProps/);
          }
        }

        if (host.browser.chrome) {
          expect(err.stack).to.match(/EvalError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: 'Not Found',
          timestamp: now.toJSON(),
          foo: 'bar'
        }));
      }
    );

    it('can be called with a props object and a message',
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        var err = (function newErrorWithPropsAndMessage () {
          return ono({
            code: 404,
            text: 'Not Found',
            timestamp: now,
            someMethod: someMethod
          }, 'Onoes! Something bad happened.');
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Onoes! Something bad happened.');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal('Not Found');
        expect(err.timestamp).to.equal(now);
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/newErrorWithPropsAndMessage/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: 'Not Found',
          timestamp: now.toJSON()
        }));
      });

    it('can be called with a props object and a parameterized message',
      function () {
        var now = new Date();

        function foo () {}

        var err = (function newErrorWithPropsAndParamMessage () {
          return ono({
            code: 404,
            text: 'Not Found',
            timestamp: now,
            foo: foo
          }, 'Testing, %s, %d, %j', 1, '2', '3');
        }());

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3"');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal('Not Found');
        expect(err.timestamp).to.equal(now);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/newErrorWithPropsAndParamMessage/);
          }
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: 'Not Found',
          timestamp: now.toJSON()
        }));
      }
    );

    it('can be called with an inner-error, props object, and a parameterized message',
      function () {
        var now = new Date();

        function someMethod () { return this.code; }

        function makeInnerError () {
          var err = new EvalError('This is the inner error');
          err.foo = 'bar';
          err.code = 500;
          return err;
        }

        var err = (function newErrorWithInnerErrorPropsAndParamMessage (innerErr) {
          return ono(
            innerErr,
            {
              code: 404,
              text: 'Not Found',
              timestamp: now,
              someMethod: someMethod
            },
            'Testing, %s, %d, %j', 1, '2', '3'
          );
        }(makeInnerError()));

        expect(err).to.be.an.instanceOf(ErrorType);
        expect(err.name).to.equal(ErrorTypeName);
        expect(err.message).to.equal('Testing, 1, 2, "3" \nThis is the inner error');
        expect(err.code).to.equal(404);
        expect(err.text).to.equal('Not Found');
        expect(err.timestamp).to.equal(now);
        expect(err.foo).to.equal('bar');
        expect(err.someMethod).to.equal(someMethod);
        expect(err.someMethod()).to.equal(404);

        if (err.stack) {
          expect(err.stack).not.to.contain(factoryName);

          if (!host.browser.safari) {
            expect(err.stack).to.match(/newErrorWithInnerErrorPropsAndParamMessage/);
            expect(err.stack).to.match(/makeInnerError/);
          }
        }

        if (host.browser.chrome) {
          expect(err.stack).to.match(/EvalError: This is the inner error/);
        }

        var json = JSON.parse(JSON.stringify(err));
        expect(json).to.satisfy(helper.matchesJSON({
          name: err.name,
          message: err.message,
          stack: err.stack,
          code: 404,
          text: 'Not Found',
          timestamp: now.toJSON(),
          foo: 'bar'
        }));
      }
    );

  });
});
