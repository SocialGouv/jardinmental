import React from "react";
import { act, render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Alert } from "react-native";
import Reminder from "../../src/scenes/reminder/reminder";
import NotificationService from "../../src/services/notifications";
import API from "../../src/services/api";
import logEvents from "../../src/services/logEvents";
import localStorage from "../../src/utils/localStorage";

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();

const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  reset: mockReset,
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

// Mock NotificationService
jest.mock("../../src/services/notifications", () => ({
  __esModule: true,
  default: {
    checkPermission: jest.fn(() => Promise.resolve(true)),
    checkAndAskForPermission: jest.fn(() => Promise.resolve(true)),
    hasToken: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve("mock-token-123")),
    listen: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

// Mock API
jest.mock("../../src/services/api", () => ({
  __esModule: true,
  default: {
    put: jest.fn(() => Promise.resolve({ ok: true })),
  },
}));

// Mock logEvents
jest.mock("../../src/services/logEvents", () => ({
  __esModule: true,
  default: {
    logReminderCancel: jest.fn(),
    logReminderObd: jest.fn(),
    logReminderObdEdit: jest.fn(),
    logEditReminder: jest.fn(),
    logReminderAdd: jest.fn(),
    logOnboardingBack: jest.fn(),
  },
}));

// Mock localStorage
jest.mock("../../src/utils/localStorage", () => ({
  __esModule: true,
  default: {
    setOnboardingStep: jest.fn(() => Promise.resolve()),
    setOnboardingDone: jest.fn(() => Promise.resolve()),
  },
}));

// Mock react-native-localize
jest.mock("react-native-localize", () => ({
  getLocales: jest.fn(() => [{ countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false }]),
  getTimeZone: jest.fn(() => "Europe/Paris"),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  return {
    LinearGradient: ({ children, ...props }) => {
      return React.createElement("View", props, children);
    },
  };
});

// Mock TimePicker component
jest.mock("../../src/components/timePicker", () => {
  const React = require("react");
  const { View } = require("react-native");
  return function TimePicker() {
    return React.createElement(View, { testID: "time-picker" });
  };
});

// Mock BeigeWrapperScreen
jest.mock("../../src/scenes/onboarding-v2/BeigeWrapperScreen", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return function BeigeWrapperScreen({ children, handleNext, secondaryButton, handlePrevious, disabled }) {
    return React.createElement(
      View,
      { testID: "beige-wrapper" },
      children,
      secondaryButton && React.createElement(View, { testID: "secondary-button-container" }, secondaryButton),
      React.createElement(
        TouchableOpacity,
        {
          testID: "next-button",
          onPress: handleNext,
          disabled: disabled,
        },
        React.createElement(Text, null, "Next")
      ),
      handlePrevious &&
        React.createElement(
          TouchableOpacity,
          {
            testID: "previous-button",
            onPress: handlePrevious,
          },
          React.createElement(Text, null, "Previous")
        )
    );
  };
});

// Mock JMButton
jest.mock("../../src/components/JMButton", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return function JMButton({ onPress, title, testID }) {
    return React.createElement(
      TouchableOpacity,
      {
        testID: testID || "jm-button",
        onPress: onPress,
      },
      React.createElement(Text, null, title)
    );
  };
});

// Mock NetInfo
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock DeviceInfo
jest.mock("react-native-device-info", () => ({
  getVersion: jest.fn(() => "1.0.0"),
  getBuildNumber: jest.fn(() => "1"),
  getSystemVersion: jest.fn(() => "14.0"),
  getModel: jest.fn(() => "iPhone"),
}));

const ReminderStorageKey = "@Reminder";

describe("ReminderOnboarding - Désactiver le rappel button", () => {
  // Spy on Alert.alert
  let alertSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    alertSpy = jest.spyOn(Alert, "alert");
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  const renderComponent = (route = {}) => {
    return render(
      <SafeAreaProvider>
        <NavigationContainer>
          <Reminder navigation={mockNavigation} route={route} />
        </NavigationContainer>
      </SafeAreaProvider>
    );
  };

  test("should not show 'Désactiver le rappel' button when in onboarding mode", async () => {
    const route = {
      params: {
        onboarding: true,
      },
    };

    renderComponent(route);

    await waitFor(() => {
      expect(screen.queryByText("Désactiver le rappel")).toBeNull();
    });

    // Should show "Passer" button instead
    await waitFor(() => {
      expect(screen.getByText("Passer")).toBeTruthy();
    });
  });

  test("should not show 'Désactiver le rappel' button when there is no stored reminder", async () => {
    const route = {
      params: {
        onboarding: false,
      },
    };

    // Don't store any reminder
    await AsyncStorage.removeItem(ReminderStorageKey);

    renderComponent(route);

    await waitFor(() => {
      expect(screen.queryByText("Désactiver le rappel")).toBeNull();
    });
  });

  test("should show 'Désactiver le rappel' button when there is a stored reminder and not in onboarding", async () => {
    // Store a reminder
    const reminderDate = new Date();
    reminderDate.setHours(20, 0, 0, 0);
    await AsyncStorage.setItem(ReminderStorageKey, JSON.stringify(reminderDate));

    const route = {
      params: {
        onboarding: false,
      },
    };

    renderComponent(route);

    await waitFor(() => {
      expect(screen.getByText("Désactiver le rappel")).toBeTruthy();
    });
  });

  test("should call desactivateReminder function when 'Désactiver le rappel' button is pressed", async () => {
    // Store a reminder
    const reminderDate = new Date();
    reminderDate.setHours(20, 0, 0, 0);
    await AsyncStorage.setItem(ReminderStorageKey, JSON.stringify(reminderDate));

    const route = {
      params: {
        onboarding: false,
      },
    };

    renderComponent(route);

    // Wait for the button to appear
    await waitFor(() => {
      expect(screen.getByText("Désactiver le rappel")).toBeTruthy();
    });

    // Click the button
    const desactivateButton = screen.getByText("Désactiver le rappel");
    fireEvent.press(desactivateButton);

    // Verify logEvents.logReminderCancel was called
    await waitFor(() => {
      expect(logEvents.logReminderCancel).toHaveBeenCalled();
    });

    // Verify reminder was removed from AsyncStorage
    await waitFor(async () => {
      const storedReminder = await AsyncStorage.getItem(ReminderStorageKey);
      expect(storedReminder).toBeNull();
    });

    // Verify API was called to disable reminder
    await waitFor(() => {
      expect(API.put).toHaveBeenCalledWith({
        path: "/reminder",
        body: {
          pushNotifToken: "mock-token-123",
          type: "Main",
          disabled: true,
        },
      });
    });

    // Verify onboarding was marked as done
    await waitFor(() => {
      expect(localStorage.setOnboardingDone).toHaveBeenCalledWith(true);
    });

    // Verify navigation reset was called
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [
          {
            name: "tabs",
            params: {
              onboarding: false,
            },
          },
        ],
      });
    });

    // Verify alert was shown
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Le rappel a bien été désactivé.");
    });
  });

  test("should handle desactivateReminder when device has no token", async () => {
    // Mock hasToken to return false (simulator case)
    (NotificationService.hasToken as jest.Mock).mockResolvedValueOnce(false);

    // Store a reminder
    const reminderDate = new Date();
    reminderDate.setHours(20, 0, 0, 0);
    await AsyncStorage.setItem(ReminderStorageKey, JSON.stringify(reminderDate));

    const route = {
      params: {
        onboarding: false,
      },
    };

    renderComponent(route);

    // Wait for the button to appear
    await waitFor(() => {
      expect(screen.getByText("Désactiver le rappel")).toBeTruthy();
    });

    // Click the button
    const desactivateButton = screen.getByText("Désactiver le rappel");
    fireEvent.press(desactivateButton);

    // Verify API was NOT called (because no token)
    await waitFor(() => {
      expect(API.put).not.toHaveBeenCalled();
    });

    // Verify other actions still happened
    await waitFor(() => {
      expect(logEvents.logReminderCancel).toHaveBeenCalled();
      expect(localStorage.setOnboardingDone).toHaveBeenCalledWith(true);
      expect(mockReset).toHaveBeenCalled();
    });
  });

  test("should display the reminder time correctly", async () => {
    // Store a reminder at 15:30
    const reminderDate = new Date();
    reminderDate.setHours(15, 30, 0, 0);
    await AsyncStorage.setItem(ReminderStorageKey, JSON.stringify(reminderDate));

    const route = {
      params: {
        onboarding: false,
      },
    };

    renderComponent(route);

    // Verify the time is displayed correctly
    await waitFor(() => {
      expect(screen.getByText("15:30")).toBeTruthy();
    });
  });

  test("should display default time when no reminder is stored", async () => {
    const route = {
      params: {
        onboarding: true,
      },
    };

    renderComponent(route);

    // Should display default time (20:00)
    await waitFor(() => {
      expect(screen.getByText("20:00")).toBeTruthy();
    });
  });
});
