# Event Tracking Documentation

## Overview

The application uses Matomo analytics to track user interactions. All event tracking functions are located in `app/src/services/logEvents.js`.

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
