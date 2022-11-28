import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../../components/MyText";
import CheckBox from "@react-native-community/checkbox";

import { colors } from "../../../utils/colors";

// MOVE TO COMPONENT ??
const LabelCheckBox = ({ value, onValueChange, label }) => {
  return (
    <View style={styles.container}>
      <CheckBox
        animationDuration={0.2}
        boxType="square"
        style={styles.checkbox}
        value={value}
        onValueChange={onValueChange}
        // for android
        tintColors={{ true: colors.LIGHT_BLUE, false: "#aaa" }}
        // for ios
        tintColor="#aaa"
        onCheckColor={colors.LIGHT_BLUE}
        onTintColor={colors.LIGHT_BLUE}
        onAnimationType="bounce"
        offAnimationType="bounce"
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
