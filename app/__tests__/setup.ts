import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";
import "react-native-gesture-handler/jestSetup";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));

// Global test setup
(global as any).__DEV__ = true;

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock safe area context
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

// Mock expo-squircle-view (virtual mock to avoid module resolution issues)
jest.mock(
  "expo-squircle-view",
  () => {
    const React = require("react");
    const { View } = require("react-native");

    const SquircleView = React.forwardRef((props, ref) => {
      return React.createElement(View, { ...props, ref });
    });
    SquircleView.displayName = "SquircleView";

    const SquircleButton = React.forwardRef((props, ref) => {
      return React.createElement(View, { ...props, ref });
    });

    SquircleButton.displayName = "SquircleButton";
    SquircleView.displayName = "SquircleView";

    return {
      SquircleView,
      SquircleButton,
    };
  },
  { virtual: true }
);

// Mock Sentry to prevent it from interfering with tests
jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  wrap: jest.fn((component) => component), // Return component unchanged
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  setExtra: jest.fn(),
  configureScope: jest.fn((callback) => {
    // Call callback with mock scope
    callback({
      setUser: jest.fn(),
      setTag: jest.fn(),
      setContext: jest.fn(),
      setExtra: jest.fn(),
      clear: jest.fn(),
    });
  }),
  withScope: jest.fn((callback) => {
    // Call callback with mock scope
    callback({
      setUser: jest.fn(),
      setTag: jest.fn(),
      setContext: jest.fn(),
      setExtra: jest.fn(),
      clear: jest.fn(),
    });
  }),
  getCurrentHub: jest.fn(() => ({
    getClient: jest.fn(),
    isOlderThan: jest.fn(),
    bindClient: jest.fn(),
  })),
  startTransaction: jest.fn(() => ({
    finish: jest.fn(),
    setTag: jest.fn(),
    setData: jest.fn(),
  })),
  Severity: {
    Fatal: "fatal",
    Error: "error",
    Warning: "warning",
    Info: "info",
    Debug: "debug",
  },
}));
