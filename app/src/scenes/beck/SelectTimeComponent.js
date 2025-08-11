import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";
import { getTime, timeStringToISODate, displayOnlyHourAndMinute } from "../../utils/date/helpers";
import TimePicker from "../../components/timePicker";
import Text from "../../components/MyText";

export default ({ onChange = console.log, placeholder = "Choisir", iconName, value }) => {
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const handleChange = (e) => {
    setTimePickerVisible(false);
    if (!e) onChange(null);
    const v = getTime(e);
    onChange(v);
  };

  return (
    <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
      <View style={styles.container}>
        {iconName ? (
          <View style={styles.iconLeftContainer}>
            <Icon icon={iconName} color={colors.DARK_BLUE} width={25} height={25} />
          </View>
        ) : null}
        <View style={styles.selectContainer}>
          {value ? (
            <Text style={[styles.text, styles.value]}>{displayOnlyHourAndMinute(value)}</Text>
          ) : (
            <Text style={[styles.text, styles.placeholder]}>{placeholder}</Text>
          )}
        </View>
        <View style={styles.iconContainer}>
          <Icon icon="ArrowUpSvg" color={colors.DARK_BLUE} width={13} height={13} />
        </View>
        <TimePicker visible={timePickerVisible} selectDate={handleChange} headerTextIOS="Choisir l'heure" value={timeStringToISODate(value)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginRight: 8,
    transform: [{ rotate: "180deg" }],
  },
  iconLeftContainer: {
    display: "flex",
    height: "100%",
  },
  selectContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    flex: 1,
  },
  container: {
    padding: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#D4F0F2",
    backgroundColor: "#F4FCFD",
    borderRadius: 8,
    color: colors.DARK_BLUE,
  },
  text: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    minWidth: "100%",
    width: "100%",
    textAlign: "left",
  },
  value: {
    color: colors.DARK_BLUE,
  },
  placeholder: {
    color: "lightgrey",
  },
});
