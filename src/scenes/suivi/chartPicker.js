import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import RoundButtonIcon from "../../components/RoundButtonIcon";

const ChartPicker = ({ onBeforePress, onAfterPress, title = "XXX" }) => {
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <RoundButtonIcon icon="arrow-left" visible onPress={onBeforePress} small />
      </View>
      <TouchableOpacity style={styles.contentContainer}>
        <Text style={styles.content}>{title}</Text>
      </TouchableOpacity>
      <View style={styles.button}>
        <RoundButtonIcon icon="arrow-right" visible onPress={onAfterPress} small />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
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
