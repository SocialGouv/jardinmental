# Jardin Mental Mobile App

This is the mobile application for Jardin Mental, built with React Native and Expo.

---

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (see root `package.json` for recommended version)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install dependencies

```bash
pnpm install
```

---

## Running the App

### Start the development server

```bash
pnpm expo start
```

### Run on iOS simulator

```bash
pnpm expo run ios
```

### Run on Android emulator

> **Note:** To run the app on Android using `pnpm expo run android`, you must have a valid `google-services.json` file in the `app` folder.

```bash
pnpm expo run android
```

---

## Where to Find `google-services.json`

The `google-services.json` file is required for Android builds and is **not included in the repository** for security reasons.

- **If you are a maintainer or contributor:**  
  You can generate this file from the [Firebase Console](https://console.firebase.google.com/) by selecting the appropriate project and downloading the configuration for the Android app (make sure to use the correct package name).
  You can find it here : https://console.firebase.google.com/project/jardin-mental/settings/general/android:com.monsuivipsy
- **If you do not have access:**  
  Please contact a project maintainer to request the `google-services.json` file.

Once obtained, place the file in the `app` folder:  
`/app/google-services.json`

---

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Tests for CI/CD
pnpm test:ci
```

---

## Release / Publish

### Version Bumping

Version numbers must be updated manually in the relevant files:

- Android: `android/app/build.gradle` (`versionCode` and `versionName`)
- iOS: `ios/jardinmental.xcodeproj/project.pbxproj` (`CURRENT_PROJECT_VERSION` and `MARKETING_VERSION`)

> **Note:** You cannot upload the same `versionCode`/`CURRENT_PROJECT_VERSION` twice. Always increment for each release.

### Build for Local Device

- **iOS:**
  ```bash
  pnpm expo run ios
  ```
- **Android:**
  ```bash
  pnpm expo run android
  ```

### Build for Store Submission (Local Build)

To avoid consuming EAS credits, use local builds:

- **iOS:**
  ```bash
  eas build -p ios --local
  ```
- **Android:**
  > **Important:** Before running the build command, you must comment out the two lines in `.gitignore` that reference `google-services.json`.  
  > This is a workaround required for the build to succeed. Uncomment them after the build if needed.  
  > There is probably a better configuration to avoid this step, but we haven't found the solution yet.
  ```bash
  eas build -p android --local
  ```

After building:

- For iOS, upload the `.ipa` file using [Transporter](https://apps.apple.com/us/app/transporter/id1450874784) to App Store Connect.
- For Android, upload the `.aab` file to the Google Play Console.

---

## Event Tracking Documentation

### Overview

The application uses Matomo analytics to track user interactions. All event tracking functions are located in `app/src/services/logEvents.js`. See [logEvents.js](https://github.com/SocialGouv/jardinmental/blob/master/app/src/services/logEvents.js) for implementation details.

### Event Structure

```javascript
{
  category: string,   // Event category (e.g., "APP", "FEELING")
  action: string,     // Action name (e.g., "APP_OPEN")
  name?: string,      // Optional context
  value?: any         // Optional value
}
```

### Main Categories

#### Core App Events

```javascript
logEvents.logAppVisit(); // App open
logEvents.logAppClose(); // App close
```

#### User Data Events

```javascript
// Feelings
logEvents.logFeelingStart();
logEvents._deprecatedLogFeelingAdd();

// Medications
logEvents.logDrugsOpen();
```

#### Navigation

```javascript
logEvents.logOpenPage(category);
logEvents.logStatusSubPage(tab);
```

### Notes

- Events are sent only when network is available
- User IDs are randomly generated
- Device info limited to OS and app version

---

## Indicators Configuration

The application uses a predefined set of indicators to track user's health and well-being, defined in `app/src/utils/liste_indicateurs.1.js`. See [liste_indicateurs.1.js](https://github.com/SocialGouv/jardinmental/blob/master/app/src/utils/liste_indicateurs.1.js) for implementation details.

### Indicator Structure

```javascript
{
  uuid: string,     // Unique identifier for the indicator
  name: string,     // Display name
  category: string, // Category ("Emotions/sentiments" or "Manifestations physiques")
  order: string,    // Sort order ("ASC" or "DESC")
  type: string      // Input type ("smiley", "gauge", or "boolean")
}
```

### Main Categories

1. **Emotions/sentiments**
2. **Manifestations physiques**
3. **Thoughts**
4. **Behaviors**

### Special Collections

The file defines several special collections of indicators:

1. **INDICATEURS_HUMEUR**: General mood tracking
2. **INDICATEURS_SOMMEIL**: Sleep quality tracking
3. **INDICATEURS_LISTE_ONBOARDING_HUMEUR**: Mood tracking during onboarding (morning, midday, bedtime)
4. **INDICATEURS_LISTE_ONBOARDING_SOMMEIL**: Sleep-related indicators during onboarding
5. **INDICATEURS**: Complete list of all available indicators

### Input Types

- **smiley**: Mood selection using emoji-style interface
- **gauge**: Sliding scale for intensity measurement
- **boolean**: Yes/No toggle for binary states

---

## Troubleshooting

If you encounter issues running or building the app, try the following steps:

- **Kill the Expo server:**  
  Make sure to stop any running Expo servers (e.g., with <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal), or kill all Expo-related processes if needed.

- **Clean the native directories:**  
  If you have persistent build or dependency issues, you can remove the native directories and regenerate them:

  ```bash
  rm -rf ios
  rm -rf android
  npx expo prebuild --clean
  ```

- **Clear Expo cache:**  
  Sometimes, clearing the Expo cache can resolve unexpected errors:
  ```bash
  expo start --clear
  ```
