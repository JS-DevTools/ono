// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
// https://jstools.dev/karma-config/

"use strict";
const { karmaConfig } = require("@jsdevtools/karma-config");
const { host } = require("@jsdevtools/host-environment");

module.exports = karmaConfig({
  sourceDir: "esm",
  fixtures: "test/fixtures/**/*.js",
  browsers: {
    chrome: true,
    firefox: host.os.linux,
    safari: host.os.linux,    // SauceLabs
    edge: host.os.linux,      // SauceLabs
    ie: host.os.windows,
  },
});
