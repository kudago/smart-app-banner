Smart App Banner
================

Lightweight smart app banner with no jQuery (or any other framework) requirement.

Based on 'jQuery Smart Banner' by Arnold Daniels <arnold@jasny.net> https://github.com/jasny/jquery.smartbanner

## Difference

* Standalone (no frameworks required)
* Different icons/price for iOS and Android
* Available as npm-module

## Installation

`$ npm install --save smart-app-banner`


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
          // , force: 'ios' // Uncomment for platform emulation
      });
    </script>
  </body>
</html>
```
