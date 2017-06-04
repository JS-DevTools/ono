helper.forEachMethod(function (name, ono, ErrorType, ErrorTypeName) {
  'use strict';

  describe(name + '().toJSON', function () {
    it('should return all built-in error properties',
      function () {
        var err = (function newError (message) {
          return ono('Oh No! %s', message);
        }('Something went wrong'));

        var json = err.toJSON();
        expect(json).to.satisfy(helper.matchesJSON({
          name: ErrorTypeName,
          message: 'Oh No! Something went wrong',
          stack: err.stack
        }));
      }
    );

    it('should return custom properties',
      function () {
        var err = (function newError (message) {
          return ono({ foo: 'bar', biz: 5 }, 'Oh No! %s', message);
        }('Something went wrong'));

        var json = err.toJSON();
        expect(json).to.satisfy(helper.matchesJSON({
          name: ErrorTypeName,
          message: 'Oh No! Something went wrong',
          stack: err.stack,
          foo: 'bar',
          biz: 5
        }));
      }
    );

    it('should return custom object properties',
      function () {
        var now = new Date();
        var err = (function newError (message) {
          return ono({ foo: 'bar', biz: now }, 'Oh No! %s', message);
        }('Something went wrong'));

        var json = err.toJSON();
        expect(json).to.satisfy(helper.matchesJSON({
          name: ErrorTypeName,
          message: 'Oh No! Something went wrong',
          stack: err.stack,
          foo: 'bar',
          biz: now
        }));
      }
    );

    it('should return inherited properties',
      function () {
        var now = new Date();
        var err = (function newError (message) {
          var originalError = new Error(message);
          originalError.foo = 'bar';
          originalError.biz = 5;
          originalError.baz = now;

          return ono(originalError, { foo: 'xyz', bob: 'abc' }, 'Oh No!');
        }('Something went wrong'));

        var json = err.toJSON();
        expect(json).to.satisfy(helper.matchesJSON({
          name: ErrorTypeName,
          message: 'Oh No! \nSomething went wrong',
          stack: err.stack,
          foo: 'xyz',
          biz: 5,
          baz: now,
          bob: 'abc'
        }));
      }
    );

    it('should NOT return undefined properties',
      function () {
        var err = (function newError (message) {
          return ono({ foo: 'bar', biz: undefined }, 'Oh No! %s', message);
        }('Something went wrong'));

        var json = err.toJSON();
        expect(json).to.satisfy(helper.matchesJSON({
          name: ErrorTypeName,
          message: 'Oh No! Something went wrong',
          stack: err.stack,
          foo: 'bar'
        }));
      }
    );

    it('should NOT return function properties',
      function () {
        function noop () {}

        var err = (function newError (message) {
          return ono({ foo: 'bar', biz: noop }, 'Oh No! %s', message);
        }('Something went wrong'));

        var json = err.toJSON();
        expect(json).to.satisfy(helper.matchesJSON({
          name: ErrorTypeName,
          message: 'Oh No! Something went wrong',
          stack: err.stack,
          foo: 'bar'
        }));
      }
    );

    var factoryName = ono.name || 'onoFactory';
    it('should NOT include ' + factoryName + ' in the stack trace',
      function () {
        var now = new Date();
        var err = (function newError (message) {
          return ono({ foo: 'bar', biz: now }, 'Oh No! %s', message);
        }('Something went wrong'));

        var json = err.toJSON();

        if (json.stack) {
          expect(json.stack).not.to.contain(factoryName);
        }
      }
    );

  });
});
