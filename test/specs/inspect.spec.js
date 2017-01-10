describe('error.inspect', function () {
  'use strict';

  it('should contain newlines instead of "\\n"',
    function () {
      var err = (function newError () {
        var originalError = new Error('Something went wrong');
        return ono(originalError, 'Oh No!');
      }());

      var json = err.inspect();
      expect(json).to.contain('"message": "Oh No! \nSomething went wrong"');  // <-- should contain newlines
      expect(json).not.to.contain('\\n');     // <-- should NOT contain escaped newlines
    }
  );

  it('should return all built-in error properties',
    function () {
      var err = (function newError (message) {
        return ono('Oh No! %s', message);
      }('Something went wrong'));

      var json = err.inspect();
      expect(json).to.contain('\n  "name": "Error"');
      expect(json).to.contain('\n  "message": "Oh No! Something went wrong"');
      err.stack && expect(json).to.contain('\n  "stack": "');
    }
  );

  it('should return custom properties',
    function () {
      var err = (function newError (message) {
        return ono({ foo: 'bar', biz: 5 }, 'Oh No! %s', message);
      }('Something went wrong'));

      var json = err.inspect();
      expect(json).to.contain('\n  "name": "Error"');
      expect(json).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(json).to.contain('\n  "foo": "bar"');
      expect(json).to.contain('\n  "biz": 5');
      err.stack && expect(json).to.contain('\n  "stack": "');
    }
  );

  it('should return custom object properties',
    function () {
      var now = new Date();
      var err = (function newError (message) {
        return ono({ foo: 'bar', biz: now }, 'Oh No! %s', message);
      }('Something went wrong'));

      var json = err.inspect();
      expect(json).to.contain('\n  "name": "Error"');
      expect(json).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(json).to.contain('\n  "foo": "bar"');
      expect(json).to.contain('\n  "biz": "' + now.toISOString() + '"');
      err.stack && expect(json).to.contain('\n  "stack": "');
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

      var json = err.inspect();
      expect(json).to.contain('\n  "name": "Error"');
      expect(json).to.contain('\n  "message": "Oh No! \nSomething went wrong"');
      expect(json).to.contain('\n  "foo": "xyz"');
      expect(json).to.contain('\n  "biz": 5');
      expect(json).to.contain('\n  "baz": "' + now.toISOString() + '"');
      expect(json).to.contain('\n  "bob": "abc"');
      err.stack && expect(json).to.contain('\n  "stack": "');
    }
  );

  it('should NOT return undefined properties',
    function () {
      var err = (function newError (message) {
        return ono({ foo: 'bar', biz: undefined }, 'Oh No! %s', message);
      }('Something went wrong'));

      var json = err.inspect();
      expect(json).to.contain('\n  "name": "Error"');
      expect(json).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(json).to.contain('\n  "foo": "bar"');
      err.stack && expect(json).to.contain('\n  "stack": "');
    }
  );

  it('should NOT return function properties',
    function () {
      function noop () {}

      var err = (function newError (message) {
        return ono({ foo: 'bar', biz: noop }, 'Oh No! %s', message);
      }('Something went wrong'));

      var json = err.inspect();
      expect(json).to.contain('\n  "name": "Error"');
      expect(json).to.contain('\n  "message": "Oh No! Something went wrong"');
      expect(json).to.contain('\n  "foo": "bar"');
      err.stack && expect(json).to.contain('\n  "stack": "');
    }
  );
});
