import React from "react";
import { StyleSheet, Text } from "react-native";

export const InputLabel = ({ children, style, sublabel }) => {
  return <Text style={[styles.label, sublabel && styles.sublabel, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  label: {
    width: "100%",
    fontFamily: "SourceSans3",
    fontWeight: "500",
    fontSize: 16,
    color: "#000",
  },
  sublabel: {
    color: "#5A5A5A",
    fontWeight: "400",
  },
});
