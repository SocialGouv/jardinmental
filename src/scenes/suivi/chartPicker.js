import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ArrowLeftSvg from "../../../assets/svg/arrow-left.js";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";

const ChartPicker = ({ onBeforePress, onAfterPress, title = "XXX" }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBeforePress} style={styles.button}>
        <ArrowLeftSvg />
      </TouchableOpacity>
      <TouchableOpacity style={styles.contentContainer}>
        <Text style={styles.content}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={(e) => onAfterPress(e)} style={styles.button}>
        <ArrowRightSvg />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentContainer: {
    flexGrow: 0,
  },
  content: {
    color: colors.DARK_BLUE,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "400",
  },
  day: {
    fontWeight: "600",
  },
  month: {
    textTransform: "lowercase",
    fontStyle: "italic",
  },
  button: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChartPicker;
