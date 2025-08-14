import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/utils/colors";

const ActiveDot = () => <View style={styles.activeDot} />;

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.LIGHT_BLUE,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});

export default ActiveDot;
