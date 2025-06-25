import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/utils/colors";

export const Badge = ({ children, textStyle, style, circle }) => {
  return (
    <View style={[styles.badge, circle && { aspectRatio: 1 }, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.LIGHT_BLUE,
    minHeight: 24,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexBasis: 24,
  },
  text: {
    fontFamily: "Karla",
    fontWeight: "700",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
