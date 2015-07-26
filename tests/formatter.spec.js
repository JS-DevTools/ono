'use strict';

var helper = require('./helper'),
    expect = require('chai').expect,
    ono    = require('../');

describe('ono.formatter', function() {
  var originalFormatter = ono.formatter;

  before(function() {
    // A simple formatter that replaces $0, $1, $2, etc. with the corresponding param
    ono.formatter = function(message) {
      var params = Array.prototype.slice.call(arguments, 1);
      return params.reduce(function(message, param, index) {
        return message.replace('$' + index, param);
      }, message);
    };
  });

  after(function() {
    ono.formatter = originalFormatter;
  });

  it('should use a custom formatter',
    function() {
      var err = ono('$0 must be greater than $1', 4, 10);

      expect(err).to.be.an.instanceOf(Error);
      expect(err.name).to.equal('Error');
      expect(err.message).to.equal('4 must be greater than 10');

      var json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(helper.matchesJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    }
  );

  it('should use a custom formatter for type-specific methods',
    function() {
      var err = ono.type('$0 must be greater than $1', 4, 10);

      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.name).to.equal('TypeError');
      expect(err.message).to.equal('4 must be greater than 10');

      var json = JSON.parse(JSON.stringify(err));
      expect(json).to.satisfy(helper.matchesJSON({
        name: err.name,
        message: err.message,
        stack: err.stack
      }));
    }
  );

});
