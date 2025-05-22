# Jardin Mental Mobile App

## Expo Go Integration

### Overview

As of May 2025, Jardin Mental has migrated to use Expo packages, allowing for development with Expo Go. This migration provides more flexibility for developers and simplifies the development process.

### What is Expo Go?

[Expo Go](https://expo.dev/client) is a mobile app that allows you to open up apps that are being served through the Expo CLI. It provides a quick way to test your app on a physical device without having to build and install the app through traditional methods.

### Development with Expo 

1. **Start the development server**:
   ```bash
   cd app
   npm run start
   ```
2. **Use Development Build or Expo Go**:
  Here you can use either development build or expo go

  Using expo go might be easier
  1. **Use Expo Go**:
    **Install Expo Go on your device**:
      - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
      - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

    **Switch to Expo Go**:
    In the console press S, to make the expo go QR code appear

    **Connect to your app**:
      - Scan the QR code with your device (Android: Expo Go app, iOS: Camera app)
      - Or open the app directly if your device is connected to the same network

  2. **Use Development Build**:
    - choose a simulator

### Useful Expo Commands

#### Build Commands
- `npx expo prebuild -p ios --clean` - Clean and regenerate the iOS native project
- `npx expo build:ios` - Build the iOS app for development
- `npx expo prebuild -p android --clean` - Clean and regenerate the Android native project
- `npx expo build:android` - Build the Android app for development

#### Other Helpful Commands
- `npx expo doctor` - Check your project for issues
- `npx expo install` - Install compatible versions of packages
- `npx expo update` - Update Expo SDK and related packages

### Expo Push Notifications

This project uses Expo's push notification system. Here's how it works:

#### Client-Side Setup
- Uses `expo-notifications` and `expo-device` packages
- Registers device tokens with the backend
- Handles permission requests and notification channels (Android)

#### Server-Side Implementation
- Uses `expo-server-sdk` to send notifications
- Batches notifications for efficient delivery
- Handles token validation and error reporting

#### Implementation Notes
- Push tokens are stored in the user profile
- Notifications can include title, body, and sound
- Physical devices are required for testing push notifications

### Migrated Packages

The following React Native packages have been replaced with their Expo equivalents:

| Original Package | Expo Replacement |
|------------------|------------------|
| react-native-device-info | expo-application |
| @react-native-community/checkbox | expo-checkbox |
| react-native-localize | expo-localization |
| react-native-bootsplash | expo-splash-screen |

Additional Expo packages in use:
- expo-notifications
- expo-font
- expo-status-bar
- expo-updates
- expo-dev-client
- expo-device
- expo-print
- expo-sharing

### Troubleshooting

#### Common Issues

1. **QR Code not scanning**:
   - Ensure your device and development machine are on the same network
   - Try switching between LAN, Tunnel, or Local connection options

2. **App not loading**:
   - Check if the Metro bundler is running
   - Verify your network connection
   - Try closing and reopening Expo Go

3. **Expo Go version mismatch**:
   - Update Expo Go to the latest version
   - Ensure your project's Expo SDK version is compatible

---

# Event Tracking Documentation

## Overview

The application uses Matomo analytics to track user interactions. All event tracking functions are located in `app/src/services/logEvents.js`. See [logEvents.js](https://github.com/SocialGouv/jardinmental/blob/master/app/src/services/logEvents.js) for implementation details.

## Event Structure

```javascript
{
  category: string,   // Event category (e.g., "APP", "FEELING")
  action: string,     // Action name (e.g., "APP_OPEN")
  name?: string,      // Optional context
  value?: any        // Optional value
}
```

## Main Categories

### Core App Events

```javascript
logEvents.logAppVisit(); // App open
logEvents.logAppClose(); // App close
```

### User Data Events

```javascript
// Feelings
logEvents.logFeelingStart();
logEvents.logFeelingAdd();

// Medications
logEvents.logDrugsOpen();
```

### Navigation

```javascript
logEvents.logOpenPage(category);
logEvents.logStatusSubPage(tab);
```

## Notes

- Events are sent only when network is available
- User IDs are randomly generated
- Device info limited to OS and app version

## Indicators Configuration

The application uses a predefined set of indicators to track user's health and well-being, defined in `app/src/utils/liste_indicateurs.1.js`. . See [liste_indicateurs.1.js](https://github.com/SocialGouv/jardinmental/blob/master/app/src/utils/liste_indicateurs.1.js) for implementation details.

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
3. **Pensées**
4. **Comportements**

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
