'use strict';

// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function(config) {
  var baseConfig = {
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['mocha'],

    files: [
      // ono
      'dist/ono.test.js',

      // Unit tests
      'tests/helper.js',
      'tests/**/*.spec.js'
    ]
  };

  configureBrowsers(baseConfig);
  configureSauceLabs(baseConfig);
  config.set(baseConfig);
};

/**
 * Configures the browsers for the current platform
 */
function configureBrowsers(config) {
  var isMac     = /^darwin/.test(process.platform),
      isWindows = /^win/.test(process.platform),
      isLinux   = !(isMac || isWindows);

  if (isMac) {
    config.browsers = ['PhantomJS', 'Firefox', 'Chrome', 'Safari'];
  }
  else if (isLinux) {
    config.browsers = ['PhantomJS', 'Firefox'];
  }
  else if (isWindows) {
    config.browsers = ['PhantomJS', 'Firefox', 'Chrome', 'Safari', 'IE9', 'IE10', 'IE'];

    // NOTE: IE 6, 7, 8 are not supported by Chai
    config.customLaunchers = {
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10'
      }
    };
  }
}

/**
 * Configures Sauce Labs emulated browsers/devices.
 * https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs(config) {
  var username = process.env.SAUCE_USERNAME;
  var accessKey = process.env.SAUCE_ACCESS_KEY;
  var jobNumber = getJobNumber(process.env.TRAVIS_JOB_NUMBER);

  // Only run Sauce Labs if we have the username & access key.
  // And only run it for the first job in a build. No need to run it for every job.
  if (username && accessKey && jobNumber <= 1) {
    var project = require('./package.json');
    var testName = project.name + ' v' + project.version;
    var build = testName + ' Build #' + process.env.TRAVIS_JOB_NUMBER + ' @ ' + new Date();

    config.sauceLabs = {
      build: build,
      testName: testName,
      tags: [project.name],
      recordVideo: true,
      recordScreenshots: true
    };

    config.customLaunchers = {
      'IE-9': {
        base: 'SauceLabs',
        platform: 'Windows 7',
        browserName: 'internet explorer',
        version: '9'
      },
      'IE-10': {
        base: 'SauceLabs',
        platform: 'Windows 7',
        browserName: 'internet explorer',
        version: '10'
      },
      'IE-11': {
        base: 'SauceLabs',
        platform: 'Windows 7',
        browserName: 'internet explorer',
        version: '11'
      },
      'Chrome-Latest': {
        base: 'SauceLabs',
        platform: 'Windows 7',
        browserName: 'chrome'
      },
      'Firefox-Latest': {
        base: 'SauceLabs',
        platform: 'Windows 7',
        browserName: 'firefox'
      },
      'Opera-Latest': {
        base: 'SauceLabs',
        platform: 'Windows 7',
        browserName: 'opera'
      },
      'Safari-Latest': {
        base: 'SauceLabs',
        platform: 'OS X 10.10',
        browserName: 'safari'
      },
      'iOS-6': {
        base: 'SauceLabs',
        platform: 'OS X 10.10',
        browserName: 'iphone',
        version: '6'
      },
      'iOS-8': {
        base: 'SauceLabs',
        platform: 'OS X 10.10',
        browserName: 'iphone',
        version: '8'
      },
      'Android-4-4': {
        base: 'SauceLabs',
        platform: 'Linux',
        browserName: 'android',
        version: '4.4'
      },
      'Android-5': {
        base: 'SauceLabs',
        platform: 'Linux',
        browserName: 'android',
        version: '5'
      }
    };

    config.reporters.push('saucelabs');
    config.browsers = Object.keys(config.customLaunchers);
  }
}

/**
 * Returns the Travis CI job number, or 1 if there is no job number.
 *
 * Examples:
 *  - "4.1"   ->  1
 *  - "16.2"  ->  2
 *  - "16"    ->  1
 *  - ""      ->  1
 *  - null    ->  1
 */
function getJobNumber(number) {
  var match = /\.(\d+)/.exec(number);
  var job = match ? match[1] || '1' : '1';
  return parseInt(job);
}
