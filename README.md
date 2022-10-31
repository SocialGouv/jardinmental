![Mobile version](https://img.shields.io/badge/app-1.31.0-blue)
![Mobile version](https://img.shields.io/badge/api-0.1.0-purple)

# Jardin Mental
(anciènement nommée : Mon Suivi Psy)

Permettre à chacun de mieux connaitre son trouble pour faciliter le choix du bon traitement

## Deploy

### For all: bump versions

#### Concept

Both android and ios have two kind of build numbers:

- android: you can see in `'/android/app/build.gradle` file `versionCode` and `versionName`. Usually, `versionCode` is incremented by 1 for every release, and `versionName` is basic versioning like `1.0.0` or whatever.

- ios: you can see in `./ios/BalaBenzine.xcodeproj/project.pbxproj` two lines called `CURRENT_PROJECT_VERSION` and two other called `MARKETING_VERSION`. Usually, `CURRENT_PROJECT_VERSION` is incremented by 1 for every release, and `MARKETING_VERSION` is basic versioning like `1.0.0` or whatever.

#### Automatic bump

run `yarn update-mobile-app-version` with the proper arguments:

- `yarn update-mobile-app-version bump`: it will just increment +1 `versionCode` and `CURRENT_PROJECT_VERSION`
- `yarn update-mobile-app-version patch`: it will increment +1 `versionCode` and `CURRENT_PROJECT_VERSION` and increment `MARKETING_VERSION` and `versionName` from, for example, 1.0.0 to 1.0.1
- `yarn update-mobile-app-version minor`: it will increment +1 `versionCode` and `CURRENT_PROJECT_VERSION` and increment `MARKETING_VERSION` and `versionName` from, for example, 1.0.1 to 1.1.0
- `yarn update-mobile-app-version major`: it will increment +1 `versionCode` and `CURRENT_PROJECT_VERSION` and increment `MARKETING_VERSION` and `versionName` from, for example, 1.1.0 to 2.0.0

#### Manual bump

Just update manually the versions where you need to do it.

You can't upload twice the same `versionCode`/`CURRENT_PROJECT_VERSION`, whereas you can upload twice `versionName`/`MARKETING_VERSION`.
In any case, you can't upload any version lower than the previous.

So be careful when you name those.

### Android

#### Manual
Just run `yarn build:android`.
Get the `.aab` file located at `./android/app/build/outputs/bundle/release/app-release.aab`

Upload it in Google Play console, Internal Testing or Production directly, as you prefer. Better to have at least one Internal Testing tester that can check the app is properly compiled (like with a real API connection, not localhost).

#### Automatic local
(ask SRE Team to get needed files)
- obtain and add `key.properties` to `./app/android` folder
- obtain and add `my-upload-key.jks` to `./app/android/app` folder
- obtain and add `google-cloud-api-key.json` to `./app/android/fastlane` folder
- Execute this command from `./app` folder : ```yarn publish:android```

This command will build and upload your app to Google Play Console - internal tests

### iOS
#### Manual
- Open `ios/monsuivipsy.xcodeproj`, and click Product > Archive

- At the end of archiving, a new window opens: click "Distribute App". Then:

  - Select "App Store Connect", and click "Next"
  - Select "Upload", and click "Next"
  - Select all three checkoxes ("Include bitcode for iOS content", "Strip Swift symbols" and "Upload your app's symbols"), and click "Next"
  - In "Distribution certificate", select the default one, and in "monsuivipsy.app", select "iOS provisionning", and click "Next"
  - Finally, click on "Upload"

- Your app is now in the Test Flight tab in your App Store Connect. After it is reviewed, you can use it in your next App Store release.

#### Automatic local
(ask SRE Team to get needed files)
- First ensure to obtain and install the distribution certificate in your mac keychain (double click .p12 file with password) and the mobile provionning profile in xcode (double click .mobileprovision file it will open xcode). 
- obtain and add `appleApiKey.json` to `./app/ios/fastlane` folder
- Execute this command from `./app` folder : ```yarn publish:ios```

This command will build and upload your app to App Store Connect - TestFlight
