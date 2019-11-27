# ITSMIMBA?

![Frameworks](https://img.shields.io/badge/frameworks-ionic%20+%20angular%20+%20capacitor-blue)
![Android](https://img.shields.io/badge/android-green)
![iOS](https://img.shields.io/badge/iOS-lightgrey)
![License](https://img.shields.io/badge/license-AGPLv3-red)

Is There Sufficient Money In My Bank Account? An open source mobile app to help pay bills on time.

## Introduction

TODO

## Installation (from source)

1) Install [Node.js](https://nodejs.org/) (You *could* download the installer from the Node.js website, but I would recommend you to install it [with NVM](https://github.com/nvm-sh/nvm) instead)

2) Execute the command `npm install -g ionic` (If you get permission errors, you can refer to [this detailed help](https://ionicframework.com/docs/faq/tips#resolving-permission-errors))

3) Download the source code of this project (with `git clone https://github.com/Mageek627/ITSMIMBA.git`, or as a *.zip* file that you then unzip)

4) Move, in your command-line, to the root folder of the project (using [`cd`](https://en.wikipedia.org/wiki/Cd_(command)))

5) Execute `npm install`

6) (Optional) You can now execute `ionic serve` to run ITSMIMBA as a **Web app** in your browser

7) Execute `ionic build`. If you wish to install the app on Android or iOS, continue with the corresponding section.

### Android app

8) Follow the [official guide for Android setup](https://ionicframework.com/docs/installation/android) (tip: make sure the Java 8 JDK is [set to the default](https://stackoverflow.com/questions/21964709/how-to-set-or-change-the-default-java-jdk-version-on-os-x/24657630#24657630))

9) In the project folder, execute `npx cap sync android` then `cd android` then `./gradlew assembleRelease`

10) You now have the app file in **ITSMIMBA/android/app/build/outputs/apk/release/app-release-unsigned.apk**

11) Copy this file to your Android device and open it to install the app

### iOS app

8) The only official way is with a Mac computer. Follow the [official guide for iOS setup](https://ionicframework.com/docs/installation/ios).

9) In the project folder, execute `npx cap sync ios` then `npx cap open ios`

10) Xcode should now be opened. In *Project navigator*, select the project root, under the *Signing* section, ensure *Automatically manage signing* is enabled. Then, select your Development Team (created in step 8).

11) Choose your iOS device at the top and click the Play button, the app will be installed on your device

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Copyright 2019 Alexandre Khoury. This project and all of its files are distributed under the GNU Affero General Public License version 3. See `LICENSE.txt` in the project root for more details.

## Author

I'm [Alexandre Khoury](https://www.linkedin.com/in/alexandre-khoury). You can contact me by email at [itsmimba@khouryalexandre.com](mailto:itsmimba@khouryalexandre.com).
