import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import Icon from "../../components/Icon";

const ChartPicker = ({ onBeforePress, onAfterPress, title = "XXX" }) => {
  return (
    <View style={styles.currentDateContainer}>
      <TouchableOpacity onPress={onBeforePress}>
        <View style={styles.button}>
          <Icon
            icon="ArrowUpSvg"
            color="#FFFFFF"
            width={13}
            height={13}
            style={{ transform: [{ rotate: "270deg" }] }}
            styleContainer={{ width: 30, height: 30 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contentContainer}>
        <Text style={styles.content}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onAfterPress}>
        <View style={styles.button}>
          <Icon
            icon="ArrowUpSvg"
            color="#FFFFFF"
            width={13}
            height={13}
            style={{ transform: [{ rotate: "90deg" }] }}
            styleContainer={{ width: 30, height: 30 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  currentDateContainer: {
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 5,
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
  button: {
    backgroundColor: colors.DARK_BLUE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
});

export default ChartPicker;
