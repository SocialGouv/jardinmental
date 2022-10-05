import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const StickyButtonContainer = ({ children }) => {
  const insets = useSafeAreaInsets();

  const margin = Platform.select({ android: 20, ios: 0 });

  return (
    <>
      <View style={[{ paddingBottom: margin, opacity: 0 }]} pointerEvents="none">
        {children}
      </View>
      <View style={[styles.container, { paddingBottom: insets.bottom + margin }]}>{children}</View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingHorizontal: 20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
});
