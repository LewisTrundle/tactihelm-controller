# Build Steps

* Explain what Expo is https://github.com/expo/expo
* Explain what a development build is
* Explain what npm and npx is

## Step 1: Create a Development Build
Our first step is to create a development build. This is because our project requires native dependencies (for Bluetooth) which otherwise isn't accessible using Expo Go (a native runtime for React Native projects).
The following links are used as the basis for this guide:
* https://docs.expo.dev/develop/development-builds/introduction/
* https://expo.canny.io/feature-requests/p/bluetooth-1


### 1.1: Initialize Your App
A new expo app can be initialized by running the command:
> npx create-expo-app <app_name>

The --template flag can also be used to specify a template to use. For example, for a blank typescript template we can use:
> npx create-expo-app -t expo-template-blank-typescript <app_name>

Make sure to cd into your app directory:
> cd <app_name>


### 1.2 Prerequisites
The EAS CLI (Expo Application Services Command Line Interface) is recommended for installation as it allows for easy interaction with Expo services via the Command Line.<br>
https://github.com/expo/eas-cli
> npm install -g eas-cli

The expo-dev-client is required to initialize a development build. <br>
https://www.npmjs.com/package/expo-dev-client
> npx expo install expo-dev-client

It will also be useful to log into your Expo account. <br>
https://expo.dev/
> eas login


### 1.3 Configure an EAS Build
You can set your project up for use with eas build by running the following command:
> eas build:configure

Select Yes to automatically creating an EAS project, and select which plaforms you would like to configure (I recommend selecting All).

This creates an eas.json file which contains three build profiles: development, preview, production, and gives your project a project ID within app.json.


### 1.4 Install Required Packages
Before you build your project, it is a good idea to install any native dependencies which you may need. This can be done later, however the project needs to be rebuilt everytime. Some recommended libraries are:
* https://github.com/demsr/expo-ble   https://dotintent.github.io/react-native-ble-plx/
* https://www.npmjs.com/package/@config-plugins/react-native-ble-plx
* https://www.npmjs.com/package/expo-build-properties
* https://www.npmjs.com/package/expo-updates
* https://www.npmjs.com/package/expo-location
> npx expo install expo-location expo-updates expo-device expo-build-properties expo-status-bar react-native-base64 react-native-ble-plx @config-plugins/react-native-ble-plx react-native-bluetooth-classic with-rn-bluetooth-classic @shopify/react-native-skia buffer react-native-elements react-native-vector-icons react-native-screens react-native-safe-area-context


### 1.5 Update app.json
Update your app.json with the following:
>"plugins": [
>  [
>    "expo-build-properties",
>    {
>      "android": {
>        "minSdkVersion": 23
>      }
>    }
>  ],
>  [
>    "@config-plugins/react-native-ble-plx",
>    {
>      "isBackgroundEnabled": true,
>      "modes": ["peripheral", "central"],
>      "bluetoothAlwaysPermission": "Allow $(PRODUCT_NAME) to connect to Bluetooth devices"
>    }
>  ],
>  [
>    "with-rn-bluetooth-classic",
>    {
>      "peripheralUsageDescription": "Allow myDevice to check bluetooth peripheral info",
>      "alwaysUsageDescription": "Allow myDevice to always use bluetooth info",
>      "protocols": [
>        "com.myCompany.p1",
>        "com.myCompany.p2"
>      ]
>    }
>  ]
>],

### 1.6 Build Android Development Build
For Android, the steps to build for a simulator/emulator are exactly the same for if you wish to build for an Android device. To create an .apk, run the command:
> eas build --profile development --platform android

or
> eas build --profile development -p all

Next specify what you would like your Android application id to be (I recommend simply selecting the default option).<br>
Select Yes to generate a new Android keystore - this allows Expo to manage your credentials for you.

Your build should now be queued.

It should then prompt you to install and run the Android build on an emulator. If you wish to do this, simply select Yes.


### 1.7 Start a Development build
To start a development build, run the following command:
> npx expo start --dev-client