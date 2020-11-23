# Mon Suivi Psy

Permettre à chacun de mieux connaitre son trouble pour faciliter le choix du bon traitement

## Run the application in development mode

```
yarn start
```

Then, open another terminal and run:
### On iOS

```
yarn ios
```

### On Android

```
yarn android
```

## Run tests
```
yarn test
```

## Check lint
```
yarn lint
```

## Publish the app

### On Android

- Edit `android/app/build.gradle` lines 135 and 136 to change versionCode and version name

- Edit `android/gradle.properties` lines 29 and 30 to add the keystore password

- Then, run the following command :
```
yarn build:android
```

This will generate a .aab file that you can upload in Google Play Console. This file can be found in `android/app/build/outputs/bundle/release/app.aab` and uploaded in a new Play Store release.

### On iOS

- Check `ios/monsuivipsy/Info.plist` line 29 to put `NSAllowsArbitraryLoads` to false and remove `localhost` from `NSExceptionDomains`

- Open `ios/monsuivipsy.xcodeproj`, and click Product > Archive

- At the end of archiving, a new window opens: click "Distribute App". Then:
  - Select "App Store Connect", and click "Next"
  - Select "Upload", and click "Next"
  - Select all three checkoxes ("Include bitcode for iOS content", "Strip Swift symbols" and "Upload your app's symbols"), and click "Next"
  - In "Distribution certificate", select the default one, and in "monsuivipsy.app", select "iOS provisionning", and click "Next"
  - Finally, click on "Upload"
  
- Your app is now in the Test Flight tab in your App Store Connect. After it is reviewed, you can use it in your next App Store release.
