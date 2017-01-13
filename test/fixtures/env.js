(function () {
  'use strict';

  if (typeof window === 'object') {
    var userAgent = userAgentParser.parse(navigator.userAgent);

    window.env = {
      NODE: '',
      BROWSER: 'true',
      KARMA: 'true',
      CHROME: userAgent.isChrome ? 'true' : '',
      SAFARI: userAgent.isSafari ? 'true' : '',
      FIREFOX: userAgent.isFirefox ? 'true' : '',
      IE: userAgent.isIE || /Edge/.test(navigator.userAgent) ? 'true' : '',
    };
  }
  else {
    global.env = process.env;
    global.env.NODE = 'true';
  }

}());
