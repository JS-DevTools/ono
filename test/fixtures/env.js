(function () {
  'use strict';

  if (typeof window === 'object') {
    var userAgent = userAgentParser.parse(navigator.userAgent);

    window.env = {
      NODE: '',
      BROWSER: 'true',
      KARMA: 'true',
      CHROME: userAgent.isChrome,
      SAFARI: userAgent.isSafari,
      IE: userAgent.isIE || /Edge/.test(navigator.userAgent),
    };
  }
  else {
    global.env = process.env;
    global.env.NODE = 'true';
  }

}());
