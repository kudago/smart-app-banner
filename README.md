Smart App Banner [![Build Status](https://img.shields.io/travis/kudago/smart-app-banner.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/kudago/smart-app-banner)
================

[![GitHub release](https://img.shields.io/github/release/kudago/smart-app-banner.svg?maxAge=2592000&style=flat-square)](https://github.com/kudago/smart-app-banner/releases) [![Github All Releases](https://img.shields.io/github/downloads/kudago/smart-app-banner/total.svg?maxAge=2592000?style=flat-square)](https://github.com/kudago/smart-app-banner/releases) [![GitHub issues](https://img.shields.io/github/issues/kudago/smart-app-banner.svg?maxAge=2592000?style=flat-square)](https://github.com/kudago/smart-app-banner/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/kudago/smart-app-banner.svg?maxAge=2592000?style=flat-square)](https://github.com/kudago/smart-app-banner/pulls) [![GitHub contributors](https://img.shields.io/github/contributors/kudago/smart-app-banner.svg?maxAge=2592000?style=flat-square)](https://github.com/kudago/smart-app-banner/graphs/contributors) [![GitHub license](https://img.shields.io/github/license/kudago/smart-app-banner.svg?maxAge=2592000?style=flat-square)](https://github.com/kudago/smart-app-banner/blob/master/LICENSE)

[![npm version](https://img.shields.io/npm/v/smart-app-banner.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/smart-app-banner) [![npm dependencies](https://img.shields.io/david/kudago/smart-app-banner.svg?maxAge=2592000&style=flat-square)](https://david-dm.org/kudago/smart-app-banner) [![npm devDependencies](https://img.shields.io/david/dev/kudago/smart-app-banner.svg?maxAge=2592000&style=flat-square)](https://david-dm.org/kudago/smart-app-banner?type=dev) [![npm downloads](https://img.shields.io/npm/dt/smart-app-banner.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/smart-app-banner)

[![Bower version](https://img.shields.io/bower/v/smart-app-banner.svg?maxAge=2592000&style=flat-square)](https://badge.fury.io/bo/smart-app-banner)

Lightweight smart app banner for Android, iOS or Windows with no jQuery (or any other framework) requirement.

Based on [jQuery Smart Banner](https://github.com/jasny/jquery.smartbanner) by [Arnold Daniels](https://github.com/jasny).

## Difference

* Standalone (no frameworks required)
* Different icons/price for Android, iOS and Windows
* Available in bower and npm

## Installation

### <abbr title="Node Package Manager">NPM</abbr>

`npm install --save smart-app-banner`

### Bower

If you don't have `bower.json` file in you project, first run

`bower init`

then install smart-app-banner

`bower install smart-app-banner --save`


## Usage

```html
<html>
  <head>
    <title>MyPage</title>

    <meta name="apple-itunes-app" content="app-id=502838820">
    <meta name="google-play-app" content="app-id=ru.hh.android">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="node_modules/smart-app-banner/smart-app-banner.css" type="text/css" media="screen">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="android-touch-icon" href="android-icon.png" />
  </head>
  <body>
    ...
    <script src="node_modules/smart-app-banner/smart-app-banner.js"></script>
    <script type="text/javascript">
      new SmartBanner({
          daysHidden: 15,   // days to hide banner after close button is clicked (defaults to 15)
          daysReminder: 90, // days to hide banner after "VIEW" button is clicked (defaults to 90)
          appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
          title: 'MyPage',
          author: 'MyCompany LLC',
          button: 'VIEW',
          store: {
              ios: 'On the App Store',
              android: 'In Google Play',
              windows: 'In Windows store'
          },
          price: {
              ios: 'FREE',
              android: 'FREE',
              windows: 'FREE'
          }
          // , theme: '' // put platform type ('ios', 'android', etc.) here to force single theme on all device
          // , icon: '' // full path to icon image if not using website icon image
          // , force: 'ios' // Uncomment for platform emulation
      });
    </script>
  </body>
</html>
```

## Development

The following commands are available for compiling the project:

| Command | Result |
| ------- | ------ |
| `npm install` | Installs the required dependencies |
| `npm run build` | Builds the application JavaScript. |

## Alternatives

* [smartappbanner.js](https://github.com/ain/smartbanner.js) bower, npm 
* [android-app-banner](https://github.com/SpartzInc/android-app-banner/) bower
* [smart-web-app-banner](https://github.com/joshsilverman/Smart-Web-App-Banner/) bower

* [List of alternatives](https://libraries.io/search?platforms=Bower&q=smart+app+banner)
