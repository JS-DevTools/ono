(function () {
  'use strict';

  if (host.browser) {
    // Configure Mocha
    mocha.setup('bdd');
    mocha.fullTrace();
    mocha.checkLeaks();
    mocha.globals(['$0', '$1', '$2', '$3', '$4']);
  }

}());
