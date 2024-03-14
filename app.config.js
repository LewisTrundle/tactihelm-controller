const IS_DEV = process.env.APP_VARIANT === 'development';
const APP_NAME = "TactiHelm Controller";
const ANDROID_PACKAGE = "com.lewis.trundle.tactihelmcontroller";

export default {
  "name": IS_DEV ? APP_NAME + " (Dev)" : APP_NAME,
  "slug": "tactihelm-controller",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "light",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "assetBundlePatterns": [
    "**/*"
  ],
  "ios": {
    "supportsTablet": true
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": IS_DEV ? ANDROID_PACKAGE + ".dev" : ANDROID_PACKAGE
  },
  "web": {
    "favicon": "./assets/favicon.png"
  },
  "extra": {
    "eas": {
      "projectId": "257e3e87-887f-45bc-aff4-f97832198435"
    }
  },
  "plugins": [
    [
      "expo-build-properties",
      {
        "android": {
          "minSdkVersion": 23
        }
      }
    ],
    [
      "@config-plugins/react-native-ble-plx",
      {
        "isBackgroundEnabled": true,
        "modes": [
          "peripheral",
          "central"
        ],
        "bluetoothAlwaysPermission": "Allow $(PRODUCT_NAME) to connect to Bluetooth devices"
      }
    ],
    [
      "with-rn-bluetooth-classic",
      {
        "peripheralUsageDescription": "Allow myDevice to check bluetooth peripheral info",
        "alwaysUsageDescription": "Allow myDevice to always use bluetooth info",
        "protocols": [
          "com.myCompany.p1",
          "com.myCompany.p2"
        ]
      }
    ]
  ]
}
