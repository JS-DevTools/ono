"use strict";

const { host } = require("host-environment");

module.exports = Object.assign({}, host, {
  // Node.js and Chrome both have V8 stack traces, which start with the error name and message
  STACK_TRACE_INCLUDES_ERROR_NAME_AND_MESSAGE: Boolean(host.node || host.browser.chrome || host.browser.edge),

  // Errors in IE 11 and older do not include stack traces at all.
  // Safari stack traces have the script URL and line number, but no function name
  STACK_TRACES_HAVE_FUNCTION_NAMES: !host.browser.safari && !host.browser.IE,
});
