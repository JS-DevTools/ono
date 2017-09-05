'use strict';
var ono = require('..');
var statuses = require('statuses');
var codes = statuses.codes;

codes.forEach(function (code) {
  var statusMessage = statuses[code];
  var identifier = toIdentifier(statusMessage);

  exports[identifier] = function () {
    var args = Array.prototype.slice.call(arguments);
    var err = ono.apply(this, args);
    err.status = code;
    err.statusCode = code;
    if (!args.length || !err.message) {
      err.message = statusMessage;
    }
    return err;
  };
});

function toIdentifier (str) {
  return str.split(' ').map(function (token, i) {
    var f = token.slice(0, 1);
    var pre = i ? f.toUpperCase() : f.toLowerCase();
    var pos = token.slice(1);
    return pre + pos;
  }).join('').replace(/[^ _0-9a-z]/gi, '');
}
