import React from "react";
import { StyleSheet, View } from "react-native";

export default ({ style }) => <View style={[styles.separator, style]} collapsable={false} />;

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "rgba(38, 56, 124, 0.1)",
    width: "100%",
    height: 1,
    marginVertical: 8,
  },
});
