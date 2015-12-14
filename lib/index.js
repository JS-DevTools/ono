/**!
 * Ono v2.0.1
 *
 * @link https://github.com/BigstickCarpet/ono
 * @license MIT
 */
'use strict';

var util  = require('util'),
    slice = Array.prototype.slice,
    vendorSpecificErrorProperties = [
      'name', 'message', 'description', 'number', 'fileName', 'lineNumber', 'columnNumber',
      'sourceURL', 'line', 'column', 'stack'
    ];

module.exports = create(Error);
module.exports.error = create(Error);
module.exports.eval = create(EvalError);
module.exports.range = create(RangeError);
module.exports.reference = create(ReferenceError);
module.exports.syntax = create(SyntaxError);
module.exports.type = create(TypeError);
module.exports.uri = create(URIError);
module.exports.formatter = util.format;

/**
 * Creates a new {@link ono} function that creates the given Error class.
 *
 * @param {Class} Klass - The Error subclass to create
 * @returns {ono}
 */
function create(Klass) {
  /**
   * @param {Error}   [err]     - The original error, if any
   * @param {object}  [props]   - An object whose properties will be added to the error object
   * @param {string}  [message] - The error message. May contain {@link util#format} placeholders
   * @param {...*}    [params]  - Parameters that map to the `message` placeholders
   * @returns {Error}
   */
  return function ono(err, props, message, params) {
    var formattedMessage, stack;
    var formatter = module.exports.formatter;

    if (typeof(err) === 'string') {
      formattedMessage = formatter.apply(null, arguments);
      err = props = undefined;
    }
    else if (typeof(props) === 'string') {
      formattedMessage = formatter.apply(null, slice.call(arguments, 1));
    }
    else {
      formattedMessage = formatter.apply(null, slice.call(arguments, 2));
    }

    if (!(err instanceof Error)) {
      props = err;
      err = undefined;
    }

    if (err) {
      // The inner-error's message will be added to the new message
      formattedMessage += (formattedMessage ? ' \n' : '') + err.message;
    }

    // Create the new error
    // NOTE: DON'T move this to a separate function! We don't want to pollute the stack trace
    var newError = new Klass(formattedMessage);

    // Extend the new error with the additional properties
    extendError(newError, err);   // Copy properties of the original error
    extendToJSON(newError);       // Replace the original toJSON method
    extend(newError, props);      // Copy custom properties, possibly including a custom toJSON method

    return newError;
  };
}

/**
 * Extends the targetError with the properties of the source error.
 *
 * @param {Error}   targetError - The error object to extend
 * @param {?Error}  sourceError - The source error object, if any
 */
function extendError(targetError, sourceError) {
  if (sourceError) {
    var stack = sourceError.stack;
    if (stack) {
      targetError.stack += ' \n\n' + sourceError.stack;
    }

    extend(targetError, sourceError, true);
  }
}

/**
 * JavaScript engines differ in how errors are serialized to JSON - especially when it comes
 * to custom error properties and stack traces.  So we add our own toJSON method that ALWAYS
 * outputs every property of the error.
 */
function extendToJSON(error) {
  error.toJSON = errorToJSON;

  // Also add an inspect() method, for compatibility with Node.js' `util.inspect()` method
  error.inspect = errorToJSON;
}

/**
 * Extends the target object with the properties of the source object.
 *
 * @param {object}  target - The object to extend
 * @param {?source} source - The object whose properties are copied
 * @param {boolean} omitVendorSpecificProperties - Skip vendor-specific Error properties
 */
function extend(target, source, omitVendorSpecificProperties) {
  if (source && typeof(source) === 'object') {
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      // Don't bother trying to copy read-only vendor-specific Error properties
      if (omitVendorSpecificProperties && vendorSpecificErrorProperties.indexOf(key) >= 0) {
        continue;
      }

      try {
        target[key] = source[key];
      }
      catch (e) {
        // This property is read-only, so it can't be copied
      }
    }
  }
}

/**
 * Custom JSON serializer for Error objects.
 * Returns all built-in error properties, as well as extended properties.
 *
 * @returns {object}
 */
function errorToJSON() {
  // jshint -W040
  var json = {};

  // Get all the properties of this error
  var keys = Object.keys(this);

  // Also include vendor-specific properties from the prototype
  keys = keys.concat(vendorSpecificErrorProperties);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = this[key];
    if (value !== undefined) {
      json[key] = value;
    }
  }

  return json;
}
