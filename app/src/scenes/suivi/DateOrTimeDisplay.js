import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { makeSureDate } from "../../utils/date/helpers";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";

const DateOrTimeDisplay = ({ date, onPress, mode, disabled, containerStyle, touchableStyle, contentContainerStyle }) => {
  if (!date) return null;

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }
  function formatDate(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join("/");
  }

  return (
    <View style={[styles.datesContainer, containerStyle, disabled && { opacity: 0.4 }]}>
      {Boolean(date) && (
        <TouchableOpacity onPress={() => onPress(mode)} disabled={disabled} style={[touchableStyle]}>
          <View style={[styles.currentDateContainer, contentContainerStyle]}>
            <Text style={styles.currentDate}>{formatDate(makeSureDate(date))}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  datesContainer: {
    flexDirection: "row",
  },
  currentDateContainer: {
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    height: 36,
    borderRadius: 36,
    paddingHorizontal: 15,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  currentDate: {
    color: colors.DARK_BLUE,
  },
});

export default DateOrTimeDisplay;
