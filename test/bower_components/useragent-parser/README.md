# UserAgentParser

JavaScript-based user-agent string parser

## Installation

### Using node.js

```js
npm install useragent-parser-js
```

```js
var parser = require('useragent-parser');
var ua = request.headers['user-agent'];     // user-agent header from an HTTP request
console.log(parser.parse(ua));
```

### Using requirejs

```js
require(['useragent-parser'], function(parser) {
    console.log(parser.parse(ua));
});
```

### Using bower

```js
bower install useragent-parser
```

## Usage overview

### Simple

```js
var parser = userAgentParser;
var result = parser.parse(userAgentString);
```

### Result structure
 
```js
{
  isMobile: false,
  isDesktop: true,
  isTablet: false,
  isiPad: false,
  isiPod: false,
  isiPhone: false,
  isAndroid: false,
  isBlackberry: false,
  isOpera: false,
  isIE: false,
  isIECompatibilityMode: false,
  isSafari: false,
  isFirefox: false,
  isWebkit: false,
  isChrome: false,
  isKonqueror: false,
  isOmniWeb: false,
  isSeaMonkey: false,
  isFlock: false,
  isAmaya: false,
  isEpiphany: false,
  isWindows: false,
  isLinux: false,
  isLinux64: false,
  isMac: false,
  isChromeOS: false,
  isBada: false,
  isSamsung: false,
  isRaspberry: false,
  isBot: false,
  isCurl: false,
  isAndroidTablet: false,
  isWinJs: false,
  isKindleFire: false,
  isSilk: false,
  silkAccelerated: false,
  browser: "Chrome",
  version: "17.0.963.79",
  os: "Windows 7",
  platform: "Microsoft Windows",
  source: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79 Safari/535.11"
}
```

## Development

Verify, test, & minify script

### Running Tests

Ensure you have [nodeunit](https://github.com/caolan/nodeunit) by running ```npm install -g nodeunit```.

Then, run ```npm test```.

### Minify

Run ```npm run build```.

## License

(The MIT License)

Copyright (c) 2015 Nikita Krasnov

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
