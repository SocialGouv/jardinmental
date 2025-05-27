import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../../components/MyText";
import Checkbox from "expo-checkbox";

import { colors } from "../../../utils/colors";

// MOVE TO COMPONENT ??
const LabelCheckBox = ({ value, onValueChange, label }) => {
  return (
    <View style={styles.container}>
      <Checkbox
        style={styles.checkbox}
        value={value}
        onValueChange={onValueChange}
        color={value ? colors.LIGHT_BLUE : undefined}
      />
      <Text>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    marginHorizontal: 10,
    width: 25,
    height: 25,
  },
  label: {
    marginHorizontal: 10,
    color: "#000",
    fontSize: 12,
  },
});

export default LabelCheckBox;
