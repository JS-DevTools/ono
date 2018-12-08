/**
 * This script exposes test dependencies as globals. This saves us from having to `require()`
 * them in every spec file, and also allows the same spec files to work in Node.js and web browsers.
 */
(function () {
  "use strict";

  if (host.browser) {
    // Define globals for web browsers
    window.expect = chai.expect;
  }
  else {
    // Define globals for Node.js
    global.ono = require("../../");
    global.expect = require("chai").expect;
  }

}());
