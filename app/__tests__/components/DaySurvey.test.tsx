import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DaySurvey from '../../src/scenes/survey/daySurvey';
import { DiaryDataProvider } from '../../src/context/diaryData';
import { STORAGE_KEY_INDICATEURS, STORAGE_KEY_GOALS } from '../../src/utils/constants';
import { DiaryDataNewEntryInput } from '../../src/entities/DiaryData';

// Only mock what absolutely cannot run in test environment
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn((callback) => {
    // Call the callback immediately to simulate focus effect
    callback();
  }),
}));

// Mock NetInfo which is used by logEvents
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock DeviceInfo which is used by logEvents
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getSystemVersion: jest.fn(() => '14.0'),
  getModel: jest.fn(() => 'iPhone'),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  getDevicePushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-token' })),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

// Mock expo-device
jest.mock('expo-device', () => ({
  isDevice: true,
  deviceType: 1,
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        eas: {
          projectId: 'mock-project-id',
        },
      },
    },
  },
}));

// Mock react-native-localize
jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [{ countryCode: 'FR', languageTag: 'fr-FR', languageCode: 'fr', isRTL: false }]),
  getNumberFormatSettings: jest.fn(() => ({
    decimalSeparator: ',',
    groupingSeparator: ' ',
  })),
  getCalendar: jest.fn(() => 'gregorian'),
  getCountry: jest.fn(() => 'FR'),
  getCurrencies: jest.fn(() => ['EUR']),
  getTemperatureUnit: jest.fn(() => 'celsius'),
  getTimeZone: jest.fn(() => 'Europe/Paris'),
  uses24HourClock: jest.fn(() => true),
  usesMetricSystem: jest.fn(() => true),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

describe('DaySurvey Component', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
    navigate: jest.fn(),
  };

  const mockRoute = {
    params: undefined,
  };

  const renderWithProvider = (component) => {
    return render(
      <NavigationContainer>
        <DiaryDataProvider>
          {component}
        </DiaryDataProvider>
      </NavigationContainer>
    );
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    // Clear AsyncStorage before each test
    await AsyncStorage.clear();
  });

  // Helper function to create fake indicators
  const createFakeIndicators = () => [
    {
      version: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Humeur le soir',
      order: 'ASC',
      type: 'smiley',
      active: true,
      position: 0,
      created_at: new Date('2024-01-01'),
    },
    {
      version: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440002',
      name: 'ANXIETY',
      order: 'DESC',
      type: 'gauge',
      active: true,
      position: 1,
      created_at: new Date('2024-01-01'),
    },
    {
      version: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440003',
      name: 'SLEEP',
      order: 'ASC',
      type: 'boolean',
      active: true,
      position: 2,
      created_at: new Date('2024-01-01'),
    },
    {
      version: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440004',
      name: 'INACTIVE_INDICATOR',
      order: 'ASC',
      type: 'smiley',
      active: false,
      position: 3,
      created_at: new Date('2024-01-01'),
    },
    {
        type: 'smiley',
        version: 0,
        uuid: '550e8400-e29b-41d4-a716-446655440005',
        name: 'mon super indicator',
        order: 'ASC',
        active: true,
        position: 4,
        created_at: new Date('2024-01-01')
    }
  ];

  // Helper function to create fake goals
  const createFakeGoals = () => [
    {
      id: 'goal-1',
      title: 'Faire du sport',
      description: 'Faire 30 minutes de sport par jour',
      active: true,
    },
    {
      id: 'goal-2',
      title: 'Méditer',
      description: 'Méditer 10 minutes le matin',
      active: true,
    },
  ];

  test('should render correctly without crashing', () => {
    renderWithProvider(
      <DaySurvey navigation={mockNavigation} route={mockRoute} />
    );
    
    // Verify the main title is present
    expect(screen.getByText('Mon questionnaire')).toBeTruthy();
  });

  test('should render with user indicators from AsyncStorage', async () => {
    // Setup: Store fake indicators in AsyncStorage
    const fakeIndicators = createFakeIndicators();
    await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(fakeIndicators));

    renderWithProvider(
      <DaySurvey navigation={mockNavigation} route={mockRoute} />
    );

    // Verify the main title is present
    expect(screen.getByText('Mon questionnaire')).toBeTruthy();
    
    // Wait for indicators to load and verify they are rendered
    await waitFor(() => {
      expect(screen.getByText('Humeur le soir')).toBeTruthy();
      expect(screen.getByText('Anxiété')).toBeTruthy();
      expect(screen.getByText('Sommeil')).toBeTruthy();
    });

    // Verify that inactive indicators are not rendered
    expect(screen.queryByText('INACTIVE_INDICATOR')).toBeNull();

    // Verify that the "Personnaliser mes indicateurs" card is present
    expect(screen.getByText('Personnaliser mes indicateurs')).toBeTruthy();
  });

  test('should render in editing mode with existing survey data', async () => {
    // Setup: Store fake indicators
    const fakeIndicators = createFakeIndicators();
    await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(fakeIndicators));

    // Create existing survey data for editing
    const existingSurveyData = {
      date: '2024-01-15',
      answers: {
        MOOD: {
          value: 4,
          userComment: 'Feeling good today',
        },
        ANXIETY: {
          value: 2,
          userComment: 'A bit anxious about work',
        },
        SLEEP: {
          value: true,
          userComment: 'Slept well',
        },
        CONTEXT: {
          userComment: 'Had a productive day at work',
        },
        TOXIC: {
          value: false,
          userComment: 'No substances consumed',
        },
      },
    };

    const editingRoute = {
      params: {
        currentSurvey: existingSurveyData,
        editingSurvey: true,
      },
    };

    renderWithProvider(
      <DaySurvey navigation={mockNavigation} route={editingRoute} />
    );

    // Verify the main title is present
    expect(screen.getByText('Mon questionnaire')).toBeTruthy();
  });

  test('should render with goals data', async () => {
    // Setup: Store fake indicators and goals
    const fakeIndicators = createFakeIndicators();
    const fakeGoals = createFakeGoals();
    
    await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(fakeIndicators));
    await AsyncStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(fakeGoals));

    renderWithProvider(
      <DaySurvey navigation={mockNavigation} route={mockRoute} />
    );

    // Verify the main title is present
    expect(screen.getByText('Mon questionnaire')).toBeTruthy();
  });

  test('should render with pre-filled notes and context', async () => {
    // Setup: Store fake indicators
    const fakeIndicators = createFakeIndicators();
    await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(fakeIndicators));

    // Create survey data with notes and context
    const surveyWithNotes: DiaryDataNewEntryInput = {
      date: '2024-01-15',
      answers: {
        CONTEXT: {
          userComment: 'This is a general note about my day. I had meetings and felt productive.',
        },
        TOXIC: {
          value: false,
          userComment: 'Did not consume any substances today.',
        },
        'Humeur le soir': {
          value: 3,
          userComment: 'Mood was average, nothing special.',
        },
        'mon super indicator': {
          value: 5,
          userComment: 'bien utilise mon custom indicateur',
          _indicateur: {
              type: 'smiley',
              version: 0,
              uuid: '',
              name: '',
              order: 'ASC',
              active: false,
              position: 0,
              created_at: new Date()
          }
        }
      },
    };

    const routeWithNotes = {
      params: {
        currentSurvey: surveyWithNotes,
        editingSurvey: true,
      },
    };

    renderWithProvider(
      <DaySurvey navigation={mockNavigation} route={routeWithNotes} />
    );

    // Verify the main title is present
    expect(screen.getByText('Mon questionnaire')).toBeTruthy();

    // Wait for indicators to load
    await waitFor(() => {
      expect(screen.getByText('Humeur le soir')).toBeTruthy();
    });

    // Verify that the context note is properly pre-filled
    await waitFor(() => {
      expect(screen.getByDisplayValue('This is a general note about my day. I had meetings and felt productive.')).toBeTruthy();
    });

    // Verify that the toxic substance question is displayed
    expect(screen.getByText("Avez-vous consommé des substances aujourd'hui ?")).toBeTruthy();

    // Verify that the toxic substance comment is properly pre-filled
    await waitFor(() => {
      expect(screen.getByDisplayValue('Did not consume any substances today.')).toBeTruthy();
    });

    // Verify that indicator comments are properly pre-filled
    await waitFor(() => {
      expect(screen.getByDisplayValue('Mood was average, nothing special.')).toBeTruthy();
      expect(screen.getByDisplayValue('bien utilise mon custom indicateur')).toBeTruthy();
    });
  });

  test('should handle different indicator types correctly', async () => {
    // Setup: Store indicators with different types
    const mixedIndicators = [
      {
        version: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440005',
        name: 'SMILEY_INDICATOR',
        order: 'ASC',
        type: 'smiley',
        active: true,
        position: 0,
        created_at: new Date('2024-01-01'),
      },
      {
        version: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440006',
        name: 'GAUGE_INDICATOR',
        order: 'DESC',
        type: 'gauge',
        active: true,
        position: 1,
        created_at: new Date('2024-01-01'),
      },
      {
        version: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440007',
        name: 'BOOLEAN_INDICATOR',
        order: 'ASC',
        type: 'boolean',
        active: true,
        position: 2,
        created_at: new Date('2024-01-01'),
      },
    ];

    await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(mixedIndicators));

    renderWithProvider(
      <DaySurvey navigation={mockNavigation} route={mockRoute} />
    );

    // Verify the main title is present
    expect(screen.getByText('Mon questionnaire')).toBeTruthy();

    // Wait for indicators to load and verify all three types are rendered
    await waitFor(() => {
      expect(screen.getByText('SMILEY_INDICATOR')).toBeTruthy();
      expect(screen.getByText('GAUGE_INDICATOR')).toBeTruthy();
      expect(screen.getByText('BOOLEAN_INDICATOR')).toBeTruthy();
    });
  });

  test('should only render active indicators', async () => {
    // Setup: Store mix of active and inactive indicators
    const indicatorsWithInactive = createFakeIndicators(); // This includes one inactive indicator
    await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(indicatorsWithInactive));

    renderWithProvider(
      <DaySurvey navigation={mockNavigation} route={mockRoute} />
    );

    // Verify the main title is present
    expect(screen.getByText('Mon questionnaire')).toBeTruthy();

    // Wait for indicators to load and verify only active ones are rendered
    await waitFor(() => {
      expect(screen.getByText('Humeur le soir')).toBeTruthy();
      expect(screen.getByText('Anxiété')).toBeTruthy();
      expect(screen.getByText('Sommeil')).toBeTruthy();
    });

    // Verify that inactive indicators are not rendered
    expect(screen.queryByText('INACTIVE_INDICATOR')).toBeNull();
  });
});
