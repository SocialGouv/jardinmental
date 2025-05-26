# Test

```bash
# Exécuter tous les tests
yarn test

# Exécuter les tests en mode watch
yarn test:watch

# Générer un rapport de couverture
yarn test:coverage

# Tests pour CI/CD
yarn test:ci
```

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


