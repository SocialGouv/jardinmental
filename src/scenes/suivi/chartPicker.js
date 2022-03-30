import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ArrowLeftSvg from "../../../assets/svg/arrow-left.js";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";

const ChartPicker = ({
  onBeforePress,
  onAfterPress,
  previousTitle = "---",
  nextTitle = "+++",
  title = "XXX",
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBeforePress} style={styles.inactiveContentContainer}>
        <Text style={styles.inactiveContent}>{previousTitle}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.activeContentContainer}>
        <Text style={styles.activeContent}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={(e) => onAfterPress(e)} style={styles.inactiveContentContainer}>
        <Text style={styles.inactiveContent}>{nextTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    // marginHorizontal: -20,
    marginBottom: 5,
    borderColor: "#ddd",
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
  },
  activeContentContainer: {
    flexGrow: 1,
  },
  inactiveContentContainer: {
    flexShrink: 1,
    flexBasis: 100,
  },
  activeContent: {
    // flex: 1,
    // borderColor: "red",
    // borderWidth: 1,
    color: colors.DARK_BLUE,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "400",
  },
  inactiveContent: {
    // borderColor: "blue",
    // borderWidth: 1,
    color: "#888",
    opacity: 0.7,
    textAlign: "center",
    fontSize: 16,
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
