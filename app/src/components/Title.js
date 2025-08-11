import React from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "@/utils/colors";

export const Title = ({ children, style, fill = true, align }) => {
  return <Text style={[styles.text, fill && { width: "100%" }, align && { textAlign: align }, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "SourceSans3",
    fontWeight: "700",
    fontSize: 16,
    color: colors.BLUE,
    textAlign: "center",
  },
});
