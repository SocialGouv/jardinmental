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

// Mock expo-squircle-view
jest.mock("expo-squircle-view", () => {
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
});

// jest.mock("expo-squircle-view", () => {
//   const React = require("react");
//   const { View } = require("react-native");

//   const SquircleView = React.forwardRef((props, ref) => {
//     return <View {...props} ref={ref} />;
//   });

//   SquircleView.displayName = "SquircleView"; // 👈 Explicitly set displayName

//   return { SquircleView };
// });
