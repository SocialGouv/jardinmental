import React from "react";
import { View, StyleSheet } from "react-native";

import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import DateOrTimeDisplay from "./DateOrTimeDisplay";
// import DatePicker from "../../components/DatePicker";
import { makeSureTimestamp } from "../../utils/date/helpers";
import DatePicker from "react-native-date-picker";

const ChartPicker = ({}) => {
  const [fromDate, setFromDate] = React.useState(new Date());
  const [openFromDate, setOpenFromDate] = React.useState(false);

  const [toDate, setToDate] = React.useState(new Date());
  const [openToDate, setOpenToDate] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>du</Text>
      <DateOrTimeDisplay mode="date" date={fromDate} onPress={() => setOpenFromDate(true)} />
      <Text style={styles.text}>au</Text>
      <DateOrTimeDisplay mode="date" date={toDate} onPress={() => setOpenToDate(true)} />
      <DatePicker
        title="Du"
        maximumDate={new Date()}
        androidVariant="iosClone"
        mode="date"
        modal
        open={openFromDate}
        date={fromDate}
        onConfirm={(date) => {
          setFromDate(date);
          setOpenFromDate(false);
        }}
        onCancel={() => {
          setOpenFromDate(false);
        }}
      />
      <DatePicker
        title="Au"
        maximumDate={new Date()}
        androidVariant="iosClone"
        mode="date"
        modal
        open={openToDate}
        date={toDate}
        onConfirm={(date) => {
          setToDate(date);
          setOpenToDate(false);
        }}
        onCancel={() => {
          setOpenToDate(false);
        }}
      />

      {/* <DatePicker
        visible={Boolean(showDatePicker.visible)}
        mode={"date"}
        initDate={showDatePicker.value}
        selectDate={(newDate) => {
          const newDateObject = new Date(newDate);
          const oldDateObject = new Date(showDatePicker.value);
          newDate = new Date(
            newDateObject.getFullYear(),
            newDateObject.getMonth(),
            newDateObject.getDate(),
            oldDateObject.getHours(),
            oldDateObject.getMinutes()
          );

          setShowDatePicker({ visible: false });
          if (newDate) {
            showDatePicker.setter(makeSureTimestamp(newDate));
          }
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  text: {
    padding: 5,
  },
});

export default ChartPicker;
