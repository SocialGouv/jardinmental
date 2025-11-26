import React from "react";
import { StyleSheet, View } from "react-native";

export default ({ style, separatorColor }: { style?: any; separatorColor?: string }) => (
  <View style={[styles.separator, style]} collapsable={false}>
    <View
      style={[
        styles.separatorContent,
        {
          backgroundColor: separatorColor,
        },
      ]}
      collapsable={false}
    />
  </View>
);

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    marginVertical: 8,
  },
  separatorContent: {
    backgroundColor: "rgba(38, 56, 124, 0.1)",
    flex: 1,
  },
});
