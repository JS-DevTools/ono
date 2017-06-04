helper.forEachMethod(function (name, ono, ErrorType, ErrorTypeName) {
  'use strict';

  describe(name + '().inspect', function () {
    it('should contain newlines instead of "\\n"',
      function () {
        function newError () {
          var originalError = new Error('Something went wrong');
          return ono(originalError, 'Oh No!');
        }

        var err = newError();
        var string = err.inspect();

        expect(string).to.contain('"message": "Oh No! \nSomething went wrong"');  // <-- should contain newlines
        expect(string).not.to.contain('\\n');     // <-- should NOT contain escaped newlines
      }
    );

    it('should return all built-in error properties',
      function () {
        function newError (message) {
          return ono('Oh No! %s', message);
        }

        var err = newError('Something went wrong');
        var string = err.inspect();

        expect(string).to.contain('\n  "name": "' + ErrorTypeName + '"');
        expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');

        if (err.stack) {
          expect(string).to.contain('\n  "stack": "');
        }
      }
    );

    it('should return custom properties',
      function () {
        function newError (message) {
          return ono({ foo: 'bar', biz: 5 }, 'Oh No! %s', message);
        }

        var err = newError('Something went wrong');
        var string = err.inspect();

        expect(string).to.contain('\n  "name": "' + ErrorTypeName + '"');
        expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
        expect(string).to.contain('\n  "foo": "bar"');
        expect(string).to.contain('\n  "biz": 5');

        if (err.stack) {
          expect(string).to.contain('\n  "stack": "');
        }
      }
    );

    it('should return custom object properties',
      function () {
        var now = new Date();
        function newError (message) {
          return ono({ foo: 'bar', biz: now }, 'Oh No! %s', message);
        }

        var err = newError('Something went wrong');
        var string = err.inspect();

        expect(string).to.contain('\n  "name": "' + ErrorTypeName + '"');
        expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
        expect(string).to.contain('\n  "foo": "bar"');
        expect(string).to.contain('\n  "biz": "' + now.toISOString() + '"');

        if (err.stack) {
          expect(string).to.contain('\n  "stack": "');
        }
      }
    );

    it('should return inherited properties',
      function () {
        var now = new Date();
        function newError (message) {
          var originalError = new Error(message);
          originalError.foo = 'bar';
          originalError.biz = 5;
          originalError.baz = now;

          return ono(originalError, { foo: 'xyz', bob: 'abc' }, 'Oh No!');
        }

        var err = newError('Something went wrong');
        var string = err.inspect();

        expect(string).to.contain('\n  "name": "' + ErrorTypeName + '"');
        expect(string).to.contain('\n  "message": "Oh No! \nSomething went wrong"');
        expect(string).to.contain('\n  "foo": "xyz"');
        expect(string).to.contain('\n  "biz": 5');
        expect(string).to.contain('\n  "baz": "' + now.toISOString() + '"');
        expect(string).to.contain('\n  "bob": "abc"');

        if (err.stack) {
          expect(string).to.contain('\n  "stack": "');
        }
      }
    );

    it('should NOT return undefined properties',
      function () {
        function newError (message) {
          return ono({ foo: 'bar', biz: undefined }, 'Oh No! %s', message);
        }

        var err = newError('Something went wrong');
        var string = err.inspect();

        expect(string).to.contain('\n  "name": "' + ErrorTypeName + '"');
        expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
        expect(string).to.contain('\n  "foo": "bar"');

        if (err.stack) {
          expect(string).to.contain('\n  "stack": "');
        }
      }
    );

    it('should NOT return function properties',
      function () {
        function noop () {}

        function newError (message) {
          return ono({ foo: 'bar', biz: noop }, 'Oh No! %s', message);
        }

        var err = newError('Something went wrong');
        var string = err.inspect();

        expect(string).to.contain('\n  "name": "' + ErrorTypeName + '"');
        expect(string).to.contain('\n  "message": "Oh No! Something went wrong"');
        expect(string).to.contain('\n  "foo": "bar"');

        if (err.stack) {
          expect(string).to.contain('\n  "stack": "');
        }
      }
    );

    var factoryName = ono.name || 'onoFactory';
    it('should NOT include ' + factoryName + ' in the stack trace',
      function () {
        var now = new Date();
        function newError (message) {
          return ono({ foo: 'bar', biz: now }, 'Oh No! %s', message);
        }

        var err = newError('Something went wrong');
        var string = err.inspect();

        expect(string).not.to.contain(factoryName);

        if (err.stack) {
          expect(string).to.contain('\n  "stack": "');
        }
      }
    );

  });
});
