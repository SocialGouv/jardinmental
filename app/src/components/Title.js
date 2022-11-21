import React from "react";
import { StyleSheet, Text } from "react-native";

export const Title = ({ children, style, fill = true, align }) => {
  return (
    <Text style={[styles.text, fill && { width: "100%" }, align && { textAlign: align }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Karla",
    fontWeight: "700",
    fontSize: 16,
    color: "#26387C",
    textAlign: "center",
  },
});
