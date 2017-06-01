# Change Log
All notable changes will be documented in this file.
`ono` adheres to [Semantic Versioning](http://semver.org/).


## [v3.0.0](https://github.com/BigstickCarpet/ono/tree/v3.0.0) (2017-06-01)

- Updated all dependencies and verified support for Node 8.0
- Ono no longer appears in error stack traces, so errors look like they came directly from your code

[Full Changelog](https://github.com/BigstickCarpet/ono/compare/v2.0.0...v3.0.0)


## [v2.0.0](https://github.com/BigstickCarpet/ono/tree/v2.0.0) (2015-12-14)

- Did a major refactoring and code cleanup
- Support for various browser-specific `Error.prototype` properties (`fileName`, `lineNumber`, `sourceURL`, etc.)
- If you define a custom `toJSON()` method on an error object, Ono will no longer overwrite it
- Added support for Node's `util.inspect()`

[Full Changelog](https://github.com/BigstickCarpet/ono/compare/v1.0.22...v2.0.0)
