import React from "react";
import { StyleSheet, Text } from "react-native";

export const InputLabel = ({ children, style }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    width: "100%",
    fontFamily: "Karla",
    fontWeight: "400",
    fontSize: 16,
    color: "#000",
  },
});
