/**
 * This script exposes everything as globals, to allow tests to run in Node and in browsers.
 *
 * Why not use Browserify instead of globals?
 *  - To make sure Ono works properly when Node and CommonJS are not available
 *  - Some of our devDependencies have separate packages packages for Node vs. Browser (e.g. Mocha)
 *  - This reduces redundant boilerplate code in the .spec files
 */
(function () {
  'use strict';

  if (typeof (window) === 'object') {
    // Expose Browser globals
    window.global = window;
    window.expect = chai.expect;
    window.userAgent = userAgentParser.parse(navigator.userAgent);
    window.userAgent.isNode = false;
    window.userAgent.isBrowser = true;
    window.userAgent.isIE = window.userAgent.isIE || /Edge/.test(navigator.userAgent);
  }
  else {
    // Expose Node globals
    global.ono = require('../../');
    global.expect = require('chai').expect;

    global.userAgent = {
      isNode: true,
      isChrome: true,
      isBrowser: false
    };
  }

}());
