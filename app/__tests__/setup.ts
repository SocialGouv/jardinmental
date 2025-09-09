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
