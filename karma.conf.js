// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
// https://jsdevtools.org/karma-config/

"use strict";
const { karmaConfig } = require("karma-config");

module.exports = karmaConfig({
  sourceDir: "esm",
  browsers: {
    ie: true,
  },
});
