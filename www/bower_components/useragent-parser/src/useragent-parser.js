/**
 * useragent-parser
 * JavaScript-based user-agent string parser
 * @version 1.0.3
 * @author nokrasnov <nokrasnov@gmail.com>
 * @link https://github.com/nokrasnov/useragent-parser
 * @license MIT
 */

(function (window, undefined) {

    'use strict';

    /**
     *
     * @revision    $Id: express-useragent.js 2012-03-24 16:21:10 Aleksey $
     * @created     2011-12-10 17:19:10
     * @category    Express Helpers
     * @package     express-useragent
     * @copyright   Copyright (c) 2009-2011 - All rights reserved.
     * @license     MIT License
     * @author      Alexey Gordeyev IK <aleksej@gordejev.lv>
     * @link        http://www.gordejev.lv
     *
     */

    var UserAgentParser = function () {
        this.version = '1.0.3';
        this._Versions = {
            Firefox: /firefox\/([\d\w\.\-]+)/i,
            IE: /msie\s([\d\.]+[\d])|trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i,
            Chrome: /chrome\/([\d\w\.\-]+)/i,
            Chromium: /(?:chromium|crios)\/([\d\w\.\-]+)/i,
            Safari: /version\/([\d\w\.\-]+)/i,
            Opera: /version\/([\d\w\.\-]+)/i,
            Ps3: /([\d\w\.\-]+)\)\s*$/i,
            Psp: /([\d\w\.\-]+)\)?\s*$/i,
            Amaya: /amaya\/([\d\w\.\-]+)/i,
            SeaMonkey: /seamonkey\/([\d\w\.\-]+)/i,
            OmniWeb: /omniweb\/v([\d\w\.\-]+)/i,
            Flock: /flock\/([\d\w\.\-]+)/i,
            Epiphany: /epiphany\/([\d\w\.\-]+)/i,
            WinJs: /msapphost\/([\d\w\.\-]+)/i
        };
        this._Browsers = {
            Amaya: /amaya/i,
            Konqueror: /konqueror/i,
            Epiphany: /epiphany/i,
            SeaMonkey: /seamonkey/i,
            Flock: /flock/i,
            OmniWeb: /omniweb/i,
            Chromium: /chromium|crios/i,
            Chrome: /chrome/i,
            Safari: /safari/i,
            IE: /msie|trident/i,
            Opera: /opera/i,
            PS3: /playstation 3/i,
            PSP: /playstation portable/i,
            Firefox: /firefox/i,
            WinJs: /msapphost/i
        };
        this._OS = {
            Windows10: /windows nt 10\.0/i,
            Windows81: /windows nt 6\.3/i,
            Windows8: /windows nt 6\.2/i,
            Windows7: /windows nt 6\.1/i,
            UnknownWindows: /windows nt 6\.\d+/i,
            WindowsVista: /windows nt 6\.0/i,
            Windows2003: /windows nt 5\.2/i,
            WindowsXP: /windows nt 5\.1/i,
            Windows2000: /windows nt 5\.0/i,
            WindowsPhone8: /windows phone 8\./,
            OSX: /os x (\d+)[._](\d+)/i,
            Mac: /os x/i,
            iOS: /CFNetwork\/(\d+)\.(\d+)\.(\d+)/i,
            Darwin: /Darwin\/(\d+)\.(\d+)\.(\d+)/i,
            Linux: /linux/i,
            Linux64: /linux x86_64/i,
            ChromeOS: /cros/i,
            Wii: /wii/i,
            PS3: /playstation 3/i,
            PSP: /playstation portable/i,
            iPad: /\(iPad.*os (\d+)[._](\d+)/i,
            iPhone: /\(iPhone.*os (\d+)[._](\d+)/i,
            Bada: /Bada\/(\d+)\.(\d+)/i,
            Curl: /curl\/(\d+)\.(\d+)\.(\d+)/i
        };
        this._Platform = {
            Windows: /windows nt/i,
            WindowsPhone: /windows phone/i,
            Mac: /macintosh/i,
            Linux: /linux/i,
            Wii: /wii/i,
            Playstation: /playstation/i,
            iPad: /ipad/i,
            iPod: /ipod/i,
            iPhone: /iphone/i,
            Android: /android/i,
            Blackberry: /blackberry/i,
            Samsung: /samsung/i,
            Curl: /curl/i
        };
        this.agent = {};
        this.defaultAgent = {
            isMobile: false,
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
            isDesktop: false,
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
            browser: 'unknown',
            version: 'unknown',
            os: 'unknown',
            platform: 'unknown',
            geoIP: {},
            source: ''
        };

        this.getBrowser = function (string) {
            switch (true) {
                case this._Browsers.Konqueror.test(string):
                    this.agent.isKonqueror = true;
                    return 'Konqueror';
                case this._Browsers.Amaya.test(string):
                    this.agent.isAmaya = true;
                    return 'Amaya';
                case this._Browsers.Epiphany.test(string):
                    this.agent.isEpiphany = true;
                    return 'Epiphany';
                case this._Browsers.SeaMonkey.test(string):
                    this.agent.isSeaMonkey = true;
                    return 'SeaMonkey';
                case this._Browsers.Flock.test(string):
                    this.agent.isFlock = true;
                    return 'Flock';
                case this._Browsers.OmniWeb.test(string):
                    this.agent.isOmniWeb = true;
                    return 'OmniWeb';
                case this._Browsers.Chromium.test(string):
                    this.agent.isChrome = true;
                    return 'Chromium';
                case this._Browsers.Chrome.test(string):
                    this.agent.isChrome = true;
                    return 'Chrome';
                case this._Browsers.Safari.test(string):
                    this.agent.isSafari = true;
                    return 'Safari';
                case this._Browsers.WinJs.test(string):
                    this.agent.isWinJs = true;
                    return 'WinJs';
                case this._Browsers.IE.test(string):
                    this.agent.isIE = true;
                    return 'IE';
                case this._Browsers.Opera.test(string):
                    this.agent.isOpera = true;
                    return 'Opera';
                case this._Browsers.PS3.test(string):
                    return 'ps3';
                case this._Browsers.PSP.test(string):
                    return 'psp';
                case this._Browsers.Firefox.test(string):
                    this.agent.isFirefox = true;
                    return 'Firefox';
                default:
                    return 'unknown';
            }
        };
        this.getBrowserVersion = function (string) {
            var regex;
            switch (this.agent.browser) {
                case 'Chrome':
                    if (this._Versions.Chrome.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'Chromium':
                    if (this._Versions.Chromium.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'Safari':
                    if (this._Versions.Safari.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'Opera':
                    if (this._Versions.Opera.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'Firefox':
                    if (this._Versions.Firefox.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'WinJs':
                    if (this._Versions.WinJs.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'IE':
                    if (this._Versions.IE.test(string)) {
                        return RegExp.$2 ? RegExp.$2 : RegExp.$1;
                    }
                    break;
                case 'ps3':
                    if (this._Versions.Ps3.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'psp':
                    if (this._Versions.Psp.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'Amaya':
                    if (this._Versions.Amaya.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'Epiphany':
                    if (this._Versions.Epiphany.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'SeaMonkey':
                    if (this._Versions.SeaMonkey.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'Flock':
                    if (this._Versions.Flock.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                case 'OmniWeb':
                    if (this._Versions.OmniWeb.test(string)) {
                        return RegExp.$1;
                    }
                    break;
                default:
                    regex = /#{name}[\/ ]([\d\w\.\-]+)/i;
                    if (regex.test(string)) {
                        return RegExp.$1;
                    }
            }
        };

        this.getOS = function (string) {
            switch (true) {
                case this._OS.WindowsVista.test(string):
                    this.agent.isWindows = true;
                    return 'Windows Vista';
                case this._OS.Windows7.test(string):
                    this.agent.isWindows = true;
                    return 'Windows 7';
                case this._OS.Windows8.test(string):
                    this.agent.isWindows = true;
                    return 'Windows 8';
                case this._OS.Windows81.test(string):
                    this.agent.isWindows = true;
                    return 'Windows 8.1';
                case this._OS.Windows10.test(string):
                    this.agent.isWindows = true;
                    return 'Windows 10.0';
                case this._OS.Windows2003.test(string):
                    this.agent.isWindows = true;
                    return 'Windows 2003';
                case this._OS.WindowsXP.test(string):
                    this.agent.isWindows = true;
                    return 'Windows XP';
                case this._OS.Windows2000.test(string):
                    this.agent.isWindows = true;
                    return 'Windows 2000';
                case this._OS.WindowsPhone8.test(string):
                    return 'Windows Phone 8';
                case this._OS.Linux64.test(string):
                    this.agent.isLinux = true;
                    this.agent.isLinux64 = true;
                    return 'Linux 64';
                case this._OS.Linux.test(string):
                    this.agent.isLinux = true;
                    return 'Linux';
                case this._OS.ChromeOS.test(string):
                    this.agent.isChromeOS = true;
                    return 'Chrome OS';
                case this._OS.Wii.test(string):
                    return 'Wii';
                case this._OS.PS3.test(string):
                    return 'Playstation';
                case this._OS.PSP.test(string):
                    return 'Playstation';
                case this._OS.Mac.test(string):
                    this.agent.isMac = true;
                    return 'OS X';
                case this._OS.OSX.test(string):
                    this.agent.isMac = true;
                    return string.match(this._OS.OSX)[0].replace('_', '.');
                case this._OS.iOS.test(string):
                    this.agent.isMobile = true;
                    return 'iOS';
                case this._OS.Darwin.test(string):
                    this.agent.isMac = true;
                    return 'OS X';
                case this._OS.iPad.test(string):
                    this.agent.isiPad = true;
                    return string.match(this._OS.iPad)[0].replace('_', '.');
                case this._OS.iPhone.test(string):
                    this.agent.isiPhone = true;
                    return string.match(this._OS.iPhone)[0].replace('_', '.');
                case this._OS.Bada.test(string):
                    this.agent.isBada = true;
                    return 'Bada';
                case this._OS.Curl.test(string):
                    this.agent.isCurl = true;
                    return 'Curl';
                default:
                    return 'unknown';
            }
        };

        this.getPlatform = function (string) {
            switch (true) {
                case this._Platform.Windows.test(string):
                    return "Microsoft Windows";
                case this._Platform.WindowsPhone.test(string):
                    this.agent.isWindowsPhone = true;
                    return "Microsoft Windows Phone";
                case this._Platform.Mac.test(string):
                    return "Apple Mac";
                case this._Platform.Curl.test(string):
                    return "Curl";
                case this._Platform.Android.test(string):
                    this.agent.isAndroid = true;
                    return "Android";
                case this._Platform.Blackberry.test(string):
                    this.agent.isBlackberry = true;
                    return "Blackberry";
                case this._Platform.Linux.test(string):
                    return "Linux";
                case this._Platform.Wii.test(string):
                    return "Wii";
                case this._Platform.Playstation.test(string):
                    return "Playstation";
                case this._Platform.iPad.test(string):
                    this.agent.isiPad = true;
                    return "iPad";
                case this._Platform.iPod.test(string):
                    this.agent.isiPod = true;
                    return "iPod";
                case this._Platform.iPhone.test(string):
                    this.agent.isiPhone = true;
                    return "iPhone";
                case this._Platform.Samsung.test(string):
                    this.agent.isiSamsung = true;
                    return "Samsung";
                default:
                    return 'unknown';
            }
        };

        this.testCompatibilityMode = function () {
            var ua = this;
            if (this.agent.isIE) {
                if (/Trident\/(\d)\.0/i.test(ua.agent.source)) {
                    var tridentVersion = parseInt(RegExp.$1, 10);
                    var version = parseInt(ua.agent.version, 10);
                    if (version === 7 && tridentVersion === 6) {
                        ua.agent.isIECompatibilityMode = true;
                        ua.agent.version = 10.0;
                    }

                    if (version === 7 && tridentVersion === 5) {
                        ua.agent.isIECompatibilityMode = true;
                        ua.agent.version = 9.0;
                    }

                    if (version === 7 && tridentVersion === 4) {
                        ua.agent.isIECompatibilityMode = true;
                        ua.agent.version = 8.0;
                    }
                }
            }
        };

        this.testSilk = function () {
            var ua = this;
            switch (true) {
                case new RegExp('silk', 'gi').test(ua.agent.source):
                    this.agent.isSilk = true;
                default:
            }

            if (/Silk-Accelerated=true/gi.test(ua.agent.source)) {
                this.agent.silkAccelerated = true;
            }
            return this.agent.isSilk ? 'Silk' : false;
        };

        this.testKindleFire = function () {
            var ua = this;
            switch (true) {
                case /KFOT/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire';
                case /KFTT/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HD';
                case /KFJWI/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HD 8.9';
                case /KFJWA/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HD 8.9 4G';
                case /KFSOWI/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HD 7';
                case /KFTHWI/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HDX 7';
                case /KFTHWA/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HDX 7 4G';
                case /KFAPWI/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HDX 8.9';
                case /KFAPWA/gi.test(ua.agent.source):
                    this.agent.isKindleFire = true;
                    return 'Kindle Fire HDX 8.9 4G';
                default:
                    return false;
            }
        };

        this.reset = function reset() {
            var ua = this;
            for (var key in ua.defaultAgent) {
                ua.agent[key] = ua.defaultAgent[key];
            }
            return ua;
        };

        this.testMobile = function testMobile() {
            var ua = this;
            switch (true) {
                case ua.agent.isWindows:
                case ua.agent.isLinux:
                case ua.agent.isMac:
                case ua.agent.isChromeOS:
                    ua.agent.isDesktop = true;
                    break;
                case ua.agent.isAndroid:
                case ua.agent.isSamsung:
                    ua.agent.isMobile = true;
                    ua.agent.isDesktop = false;
                    break;
                default:
            }
            switch (true) {
                case ua.agent.isiPad:
                case ua.agent.isiPod:
                case ua.agent.isiPhone:
                case ua.agent.isBada:
                case ua.agent.isBlackberry:
                case ua.agent.isAndroid:
                case ua.agent.isWindowsPhone:
                    ua.agent.isMobile = true;
                    ua.agent.isDesktop = false;
                    break;
                default:
            }
            if (/mobile/i.test(ua.agent.source)) {
                ua.agent.isMobile = true;
                ua.agent.isDesktop = false;
            }
        };

        this.testTablet = function testTablet() {
            var ua = this;
            switch (true) {
                case ua.agent.isiPad:
                case ua.agent.isAndroidTablet:
                case ua.agent.isKindleFire:
                    ua.agent.isTablet = true;
                    break;
            }
            if (/tablet/i.test(ua.agent.source)) {
                ua.agent.isTablet = true;
            }
        };

        this.testNginxGeoIP = function testNginxGeoIP(headers) {
            var ua = this;
            Object.keys(headers).forEach(function (key) {
                if (/^GEOIP/i.test(key)) {
                    ua.agent.geoIP[key] = headers[key];
                }
            });
        };

        this.testBot = function testBot() {
            var ua = this;
            if (/googlebot|baiduspider|gurujibot|yandexbot|slurp|msnbot|bingbot|facebookexternalhit|linkedinbot|twitterbot|slackbot|telegrambot|applebot/i.test(ua.agent.source)) {
                ua.agent.isBot = true;
            }
        };

        this.testAndroidTablet = function testAndroidTablet() {
            var ua = this;
            if (ua.agent.isAndroid && !/mobile/i.test(ua.agent.source)) {
                ua.agent.isAndroidTablet = true;
            }
        };

        this.parse = function parse(source) {
            var ua = new UserAgentParser();
            ua.agent.source = source.replace(/^\s*/, '').replace(/\s*$/, '');
            ua.agent.os = ua.getOS(ua.agent.source);
            ua.agent.platform = ua.getPlatform(ua.agent.source);
            ua.agent.browser = ua.getBrowser(ua.agent.source);
            ua.agent.version = ua.getBrowserVersion(ua.agent.source);
            ua.testBot();
            ua.testMobile();
            ua.testAndroidTablet();
            ua.testTablet();
            ua.testCompatibilityMode();
            ua.testSilk();
            ua.testKindleFire();
            return ua.agent;
        };

        this.agent = this.defaultAgent;
    };

    // check js environment
    if (typeof(exports) !== 'undefined') {
        // nodejs env
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = new UserAgentParser;
        }
        exports = new UserAgentParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === 'function' && define.amd) {
            define(function () {
                return new UserAgentParser;
            });
        } else {
            // browser env
            window.userAgentParser = new UserAgentParser;
        }
    }

})(this);