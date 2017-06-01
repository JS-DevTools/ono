// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html

'use strict';

module.exports = function (karma) {
  var config = {
    frameworks: ['mocha', 'chai', 'host-environment'],
    reporters: ['verbose'],

    files: [
      // Ono
      'dist/ono.min.js',
      { pattern: 'dist/*.map', included: false, served: true },

      // Test Fixtures
      'test/fixtures/*.js',

      // Test Specs
      'test/specs/*.spec.js'
    ],
  };

  exitIfDisabled();
  configureCodeCoverage(config);
  configureLocalBrowsers(config);
  configureSauceLabs(config);

  console.log('Karma Config:\n', JSON.stringify(config, null, 2));
  karma.set(config);
};

/**
 * If this is a CI job, and Karma is not enabled, then exit.
 * (useful for CI jobs that are only testing Node.js, not web browsers)
 */
function exitIfDisabled () {
  var CI = process.env.CI === 'true';
  var KARMA = process.env.KARMA === 'true';

  if (CI && !KARMA) {
    console.warn('Karma is not enabled');
    process.exit();
  }
}

/**
 * Configures the code-coverage reporter
 */
function configureCodeCoverage (config) {
  if (process.argv.indexOf('--cover') === -1) {
    console.warn('Code-coverage is not enabled');
    return;
  }

  config.reporters.push('coverage');
  config.coverageReporter = {
    reporters: [
      { type: 'text-summary' },
      { type: 'lcov' }
    ]
  };

  config.files.map(function (file) {
    if (typeof file === 'string') {
      return file.replace(/^dist\/(.*)\.min\.js$/, 'dist/$1.test.js');
    }
    else {
      return file;
    }
  });
}

/**
 * Configures the browsers for the current platform
 */
function configureLocalBrowsers (config) {
  var isMac = /^darwin/.test(process.platform);
  var isWindows = /^win/.test(process.platform);
  var isLinux = !isMac && !isWindows;

  if (isMac) {
    config.browsers = ['Firefox', 'Chrome', 'Safari'];
  }
  else if (isLinux) {
    config.browsers = ['Firefox'];
  }
  else if (isWindows) {
    config.browsers = ['Firefox', 'Chrome', 'IE9', 'IE10', 'IE'];

    // NOTE: IE 6, 7, 8 are not supported by Chai
    config.customLaunchers = {
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10'
      },
    };
  }
}

/**
 * Configures Sauce Labs emulated browsers/devices.
 * https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs (config) {
  var username = process.env.SAUCE_USERNAME;
  var accessKey = process.env.SAUCE_ACCESS_KEY;

  if (!username || !accessKey) {
    console.warn('SauceLabs is not enabled');
    return;
  }

  var project = require('./package.json');
  var testName = project.name + ' v' + project.version;
  var build = testName + ' Build #' + process.env.TRAVIS_JOB_NUMBER + ' @ ' + new Date();

  var sauceLaunchers = {
    SauceLabs_Chrome_Latest: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'chrome'
    },
    SauceLabs_Firefox_Latest: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'firefox'
    },
    SauceLabs_Safari_Latest: {
      base: 'SauceLabs',
      platform: 'macOS 10.12',
      browserName: 'safari'
    },
    SauceLabs_IE_9: {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '9'
    },
    SauceLabs_IE_Edge: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge'
    },
  };

  config.reporters.push('saucelabs');
  config.browsers = config.browsers.concat(Object.keys(sauceLaunchers));
  config.customLaunchers = Object.assign(config.customLaunchers || {}, sauceLaunchers);
  config.sauceLabs = {
    build: build,
    testName: testName,
    tags: [project.name],
  };
}
