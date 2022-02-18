import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { makeSureDate } from "../../utils/date/helpers";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";

const DateOrTimeDisplay = ({ date, onPress, mode }) => {
  if (!date) return null;

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }
  function formatDate(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join("/");
  }

  return (
    <View style={styles.datesContainer}>
      {Boolean(date) && (
        <TouchableOpacity onPress={() => onPress(mode)}>
          <View style={styles.currentDateContainer}>
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
    margin: 6,
  },
  currentDateContainer: {
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    height: 30,
    borderRadius: 30,
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
