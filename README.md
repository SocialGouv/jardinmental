# Mon Suivi Psy

Permettre à chacun de mieux connaitre son trouble pour faciliter le choix du bon traitement

## Run the application in devlopment mode

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

Edit `android/app/build.gradle` lines 135 and 136 to change versionCode and version name

Edit `android/gradle.properties` lines 29 and 30 to add the keystore password

Then, run the following command :
```
yarn build:android
```

This will generate a .aab file that you can upload in Google Play Console. This file can be found in `android/app/build/outputs/bundle/release/app.aab`.
