(function () {
  'use strict';

  if (env.BROWSER) {
    // Configure Mocha
    mocha.setup('bdd');
    mocha.fullTrace();
    mocha.checkLeaks();
    mocha.globals([]);
  }

}());
