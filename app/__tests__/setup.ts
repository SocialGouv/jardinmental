// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-uuid
jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

// Mock react-native-localize
jest.mock('react-native-localize', () => ({
  getTimeZone: jest.fn(() => 'Europe/Paris'),
  getLocales: jest.fn(() => [{ countryCode: 'FR', languageTag: 'fr-FR', languageCode: 'fr', isRTL: false }]),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'test-expo-token' })),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
}));

// Mock react-native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj: any) => obj.ios),
  },
  Alert: {
    alert: jest.fn(),
  },
  Settings: {
    get: jest.fn(),
    set: jest.fn(),
  },
  NativeModules: {},
  TurboModuleRegistry: {
    getEnforcing: jest.fn(),
  },
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn((date: Date, formatStr: string) => {
    if (formatStr === 'eee') return 'lun';
    return '2024-01-01';
  }),
  setDay: jest.fn((date: Date, day: number) => new Date('2024-01-01')),
  getDay: jest.fn(() => 1), // Monday
}));

// Mock API service
jest.mock('../src/services/api', () => ({
  default: {
    put: jest.fn(() => Promise.resolve({ success: true })),
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ success: true })),
  },
}));

// Mock notifications service
jest.mock('../src/services/notifications', () => ({
  default: {
    hasToken: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('test-notification-token')),
    scheduleNotification: jest.fn(() => Promise.resolve()),
    cancelNotification: jest.fn(() => Promise.resolve()),
  },
}));

// Note: Constants are not mocked - using real values for more reliable tests

// Mock days of week
jest.mock('../src/utils/date/daysOfWeek', () => ({
  DAYS_OF_WEEK: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
}));

// Global test setup
(global as any).__DEV__ = true;

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
