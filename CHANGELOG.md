# Change Log
All notable changes will be documented in this file.
`ono` adheres to [Semantic Versioning](http://semver.org/).


## [v5.0.0](https://github.com/JS-DevTools/ono/tree/v5.0.0) (2019-02-18)

### Breaking Changes

#### in Node.js

- Ono errors previously included an `inspect()` method to support Node's [`util.inspect()` function](https://nodejs.org/api/util.html#util_util_inspect_object_options).  As of Node v6.6.0, the `inspect()` method is deprecated in favor of a [`util.inspect.custom`](https://nodejs.org/api/util.html#util_util_inspect_custom).  Ono has updated accordingly, so errors no longer have an `inspect()` method.

#### in Web Browsers

- We no longer automatically include a polyfill for [Node's `util.format()` function](https://nodejs.org/api/util.html#util_util_format_format_args).  We recommend using [ES6 template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) instead. Or you can import [a polyfill](https://github.com/tmpfs/format-util) yourself and assign it to [the `ono.formatter` property](https://jsdevtools.org/ono/#onoformatter).

### New Features

- Completely rewritten in TypeScript.

- Ono is now completely dependency free.

- You can now create your own Ono functions for custom error classes.  See [the docs](https://jsdevtools.org/ono/#custom-error-classes) for details.

- Symbol-keyed properties are now supported.  If the `originalError` and/or `props` objects has Symbol-keyed properties, they will be copied to the Ono error.

[Full Changelog](https://github.com/JS-DevTools/ono/compare/v4.0.11...v5.0.0)


## [v4.0.0](https://github.com/JS-DevTools/ono/tree/v4.0.0) (2017-07-07)

The `err` parameter (see [the API docs](https://github.com/JS-DevTools/ono#api)) can now be any type of object, not just an `instanceof Error`. This allows for errors that don't extend from the `Error` class, such as [`DOMError`](https://developer.mozilla.org/en-US/docs/Web/API/DOMError), [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException), and custom error types.

> **NOTE:** This should **not** be a breaking change, but I'm bumping the major version number out of an abundance of caution.

[Full Changelog](https://github.com/JS-DevTools/ono/compare/v3.1.0...v4.0.0)


## [v3.1.0](https://github.com/JS-DevTools/ono/tree/v3.1.0) (2017-06-01)

We removed the direct dependency on [Node's `util.format()`](https://nodejs.org/api/util.html#util_util_format_format_args), which was needlessly bloating the browser bundle. Instead, I now import [`format-util`](https://www.npmjs.com/package/format-util), which a much more [lightweight browser implementation](https://github.com/tmpfs/format-util/blob/f88c550ef10c5aaadc15a7ebab595f891bb385e1/format.js).  There's no change when running in Node.js, because `format-util` simply [exports `util.format()`](https://github.com/tmpfs/format-util/blob/392628c5d45e558589f2f19ffb9d79d4b5540010/index.js#L1).

[Full Changelog](https://github.com/JS-DevTools/ono/compare/v3.0.0...v3.1.0)


## [v3.0.0](https://github.com/JS-DevTools/ono/tree/v3.0.0) (2017-06-01)

- Updated all dependencies and verified support for Node 8.0
- Ono no longer appears in error stack traces, so errors look like they came directly from your code

[Full Changelog](https://github.com/JS-DevTools/ono/compare/v2.0.0...v3.0.0)


## [v2.0.0](https://github.com/JS-DevTools/ono/tree/v2.0.0) (2015-12-14)

- Did a major refactoring and code cleanup
- Support for various browser-specific `Error.prototype` properties (`fileName`, `lineNumber`, `sourceURL`, etc.)
- If you define a custom `toJSON()` method on an error object, Ono will no longer overwrite it
- Added support for Node's `util.inspect()`

[Full Changelog](https://github.com/JS-DevTools/ono/compare/v1.0.22...v2.0.0)
