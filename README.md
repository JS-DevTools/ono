ono (Oh No!)
============================
### Throw better errors.

[![Build Status](https://api.travis-ci.com/JS-DevTools/ono.svg?branch=master)](https://travis-ci.com/JS-DevTools/ono)
[![Coverage Status](https://coveralls.io/repos/github/JS-DevTools/ono/badge.svg?branch=master)](https://coveralls.io/github/JS-DevTools/ono)

[![npm](https://img.shields.io/npm/v/ono.svg)](https://www.npmjs.com/package/ono)
[![Dependencies](https://david-dm.org/JS-DevTools/ono.svg)](https://david-dm.org/JS-DevTools/ono)
[![License](https://img.shields.io/npm/l/ono.svg)](LICENSE)

[![OS and Browser Compatibility](https://jsdevtools.org/img/badges/ci-badges-with-ie.svg)](https://travis-ci.com/JS-DevTools/ono)



Features
--------------------------
- Wrap and re-throw an error _without_ losing the original error's message, stack trace, and properties

- Add custom properties to errors &mdash; great for error numbers, status codes, etc.

- Use [format strings](#onoformatter) for error messages &mdash; great for localization

- Enhanced support for [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [`util.inspect()`](https://nodejs.org/api/util.html#util_util_inspect_object_options) &mdash; great for logging

- Create Ono instances for your own [custom error classes](#custom-error-classes)

- [Tested](https://travis-ci.com/JS-DevTools/ono) on Node.js and all modern web browsers on Mac, Windows, and Linux.



Example
--------------------------

```javascript
const ono = require("ono");

// Throw an error with custom properties
throw ono({ code: "NOT_FOUND", status: 404 }, `Resource not found: ${url}`);

// Wrap an error without losing the original error's stack and props
throw ono(originalError, "An error occurred while saving your changes");

// Wrap an error and add custom properties
throw ono(originalError, { code: 404, status: "NOT_FOUND" });

// Wrap an error, add custom properties, and change the error message
throw ono(originalError, { code: 404, status: "NOT_FOUND" }, `Resource not found: ${url}`);

// Throw a specific Error subtype instead
// (works with any of the above signatures)
throw ono.range(...);                           // RangeError
throw ono.syntax(...);                          // SyntaxError
throw ono.reference(...);                       // ReferenceError

// Create an Ono instance for your own custom error class
const { Ono } = require("ono");
class MyErrorClass extends Error {}
ono.myError = new Ono(MyErrorClass);

// And use it just like any other Ono method
throw ono.myError(...);                         // MyErrorClass
```



Installation
--------------------------
#### Node
Install using [npm](https://docs.npmjs.com/about-npm/):

```bash
npm install ono
```



Usage
--------------------------
When using Ono in Node.js apps, you'll probably want to use **CommonJS** syntax:

```javascript
const ono = require("ono");
```

When using a transpiler such as [Babel](https://babeljs.io/) or [TypeScript](https://www.typescriptlang.org/), or a bundler such as [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/), you can use **ECMAScript modules** syntax instead:

```javascript
import ono from "ono";
```



Browser support
--------------------------
Ono supports recent versions of every major web browser.  Older browsers may require [Babel](https://babeljs.io/) and/or [polyfills](https://babeljs.io/docs/en/next/babel-polyfill).

To use Ono in a browser, you'll need to use a bundling tool such as [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/), [Parcel](https://parceljs.org/), or [Browserify](http://browserify.org/). Some bundlers may require a bit of configuration, such as setting `browser: true` in [rollup-plugin-resolve](https://github.com/rollup/rollup-plugin-node-resolve).



API
--------------------------
### `ono([originalError], [props], [message, ...])`
Creates an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object with the given properties.

* `originalError` - _(optional)_ The original error that occurred, if any. This error's message, stack trace, and properties will be copied to the new error.

* `props` - _(optional)_ An object whose properties will be copied to the new error. Properties can be anything, including objects and functions.

* `message` - _(optional)_ The error message string. If it contains placeholders, then pass each placeholder's value as an additional parameter.  See [`ono.formatter`](#onoformatter) for more info.

#### Specific error types
The default `ono()` function always creates [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) objects, but you can use any of the following methods to explicitly create the corresponding Error subclass.  The method signatures are exactly the same as above.

|Method            | Return Type
|:-----------------|:-------------------
|`ono.error()`     |[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
|`ono.eval()`      |[`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)
|`ono.range()`     |[`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
|`ono.reference()` |[`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)
|`ono.syntax()`    |[`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)
|`ono.type()`      |[`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
|`ono.uri()`       |[`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)


### `ono.formatter`
When running in Node.js, the `ono.formatter` property is set to [the `util.format()` function](https://nodejs.org/api/util.html#util_util_format_format_args), which let you use placeholders such as `%s`, `%d`, and `%j`.  You can provide the values for these when calling `ono` or any Ono method:

```javascript
throw ono("%s is invalid. Must be at least %d characters.", username, minLength);
```

This is especially useful for localization.  Here's a simplistic example:

```javascript
const errorMessages {
  invalidLength: {
    en: "%s is invalid. Must be at least %d characters.",
    es: "%s no es válido. Debe tener al menos %d caracteres.",
    zh: "%s 无效。 必须至少%d个字符。",
  }
}

let lang = getCurrentUsersLanguage();

throw ono(errorMessages.invalidLength[lang], username, minLength);
```

#### `ono.formatter` in web browsers
Web browsers don't have a built-in equivalent of Node's [`util.format()` function](https://nodejs.org/api/util.html#util_util_format_format_args), so format strings are only supported in Node.js by default.  However, you can set the `ono.formatter` property to any compatible polyfill library to enable this functionality in web browsers too.

Here are some compatible polyfill libraries:

- [format](https://www.npmjs.com/package/format)
- [format-util](https://github.com/tmpfs/format-util)


#### Custom `ono.formatter` implementation
If the standard [`util.format()`](https://nodejs.org/api/util.html#util_util_format_format_args) functionality isn't sufficient for your needs, then you can set the `ono.formatter` property to your own custom implementation.  Here's a simplistic example:

```javascript
// This is a simple formatter that replaces $0, $1, $2, ... with the corresponding argument
function myCustomFormatter(message, ...args) {
  for (let [index, arg] of args) {
    message = message.replace("$" + index, arg);
  }
  return message;
}

// Tell Ono to use your custom formatter
ono.formatter = myCustomFormatter;

// Now all Ono functions support your custom formatter
throw ono("$0 is invalid. Must be at least $1 characters.", username, minLength);
```



Custom Error Classes
--------------------------
Ono has built-in support for all of [the built-in JavaScript Error types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types).  For example, you can use `ono.reference()` to create a `ReferenceError`, or `ono.syntax()` to create a `SyntaxError`.  In addition to the built-in types, you can also create Ono instances for your own custom error classes.

```javascript
const { ono, Ono } = require("ono");
let counter = 0;

// A custom Error class that assigns a unique ID and timestamp to each error
class MyErrorClass extends Error {
  constructor(message) {
    super(message);
    this.id = ++counter;
    this.timestamp = new Date();
  }
}

// Create a new Ono method for your custom Error class
ono.myError = new Ono(MyErrorClass);

// You can use this method just like any other Ono method
throw ono.myError({ code: 404, status: "NOT_FOUND" }, `Resource not found: ${url}`);
```

The code above throws an instance of `MyErrorClass` that looks like this:

```javascript
{
  "name": "MyErrorClass",
  "message": "Resource not found: xyz.html",
  "id": 1,
  "timestamp": "2019-01-01T12:30:00.456Z",
  "code": 404,
  "status": "NOT_FOUND",
  "stack": "MyErrorClass: Resource not found: xyz.html\n   at someFunction (index.js:24:5)",
}
```



Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome!  [File an issue](https://github.com/JS-DevTools/ono/issues) on GitHub and [submit a pull request](https://github.com/JS-DevTools/ono/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/JS-DevTools/ono.git`

2. __Install dependencies__<br>
`npm install`

3. __Run the build script__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`



License
--------------------------
Ono is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jsdevtools.org/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jsdevtools.org/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jsdevtools.org/img/badges/coveralls.svg)](https://coveralls.io)
