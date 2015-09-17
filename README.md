# Cordova Johnny Five RC Car Demo

This is a Cordova RC Car demo app that connects Arduino Car using Johnny Five via BLE.

## Prerequisites

You need to have [git] and [node.js] installed on your computer,
also [bower] and [cordova] are required.

For platform-specific dependencies, see [Cordova Platform Guides].

## Initialization

To initialize necessary plugin and platform files, 
you'll need to run following command for the first time:
```sh
cordova prepare
```

## Build and Run
on Firefox OS device:
```sh
$ cordova prepare firefoxos 
```
To run your app on Firefox OS device, open [WebIDE] in Firefox and choose "Open Packaged App", select `platforms/firefoxos/www` relative to the project path, and you are ready to go!

on Android device:
```sh
$ cordova build android 
$ cordova run android --device
```

on iOS device:
```sh
$ cordova build ios 
$ cordova run ios --device
```

## Demo Videos
Running on Firefox OS
[![J5 Car Firefox OS Demo](http://img.youtube.com/vi/n0b7r30NYhQ/0.jpg)](http://www.youtube.com/watch?v=n0b7r30NYhQ)

Running on Android
[![J5 Car Android Demo](http://img.youtube.com/vi/EAuCIxdQDpc/0.jpg)](http://www.youtube.com/watch?v=EAuCIxdQDpc)

Running on iOS
[![J5 Car iOS Demo](http://img.youtube.com/vi/18iY6rmT3p8/0.jpg)](http://www.youtube.com/watch?v=18iY6rmT3p8)


[Cordova Platform Guides]: https://cordova.apache.org/docs/en/5.0.0/guide_platforms_index.md.html#Platform%20Guides
[git]: https://git-scm.com/
[node.js]: https://nodejs.org/
[cordova]: https://cordova.apache.org/docs/en/5.0.0/guide_overview_index.md.html 
[bower]: http://bower.io/ 
[WebIDE]: https://developer.mozilla.org/en-US/docs/Tools/WebIDE
