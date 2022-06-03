import React from "react";
import { View, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import logEvents from "../../services/logEvents";

import Text from "../../components/MyText";
import DateOrTimeDisplay from "./DateOrTimeDisplay";

const DateRange = (props) => {
  const [fromDate, setFromDate] = React.useState(props.fromDate);
  const [openFromDate, setOpenFromDate] = React.useState(false);

  const [toDate, setToDate] = React.useState(props.toDate);
  const [openToDate, setOpenToDate] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>du</Text>
      <DateOrTimeDisplay
        mode="date"
        date={fromDate}
        onPress={() => {
          setOpenFromDate(true);
          logEvents.logSuiviEditDateFrom();
        }}
      />
      <Text style={styles.text}>au</Text>
      <DateOrTimeDisplay
        mode="date"
        date={toDate}
        onPress={() => {
          setOpenToDate(true);
          logEvents.logSuiviEditDateTo();
        }}
      />
      <DatePicker
        timeZoneOffsetInMinutes={0}
        locale="fr"
        title="Du"
        maximumDate={toDate}
        androidVariant="iosClone"
        mode="date"
        modal
        open={openFromDate}
        date={fromDate}
        confirmText="Valider"
        onConfirm={(date) => {
          setFromDate(date);
          props.onChangeFromDate(date);
          setOpenFromDate(false);
        }}
        cancelText="Annuler"
        onCancel={() => {
          setOpenFromDate(false);
        }}
      />
      <DatePicker
        timeZoneOffsetInMinutes={0}
        locale="fr"
        title="Au"
        minimumDate={fromDate}
        androidVariant="iosClone"
        mode="date"
        modal
        open={openToDate}
        date={toDate}
        confirmText="Valider"
        onConfirm={(date) => {
          setToDate(date);
          props.onChangeToDate(date);
          setOpenToDate(false);
        }}
        cancelText="Annuler"
        onCancel={() => {
          setOpenToDate(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    padding: 5,
  },
});

export default DateRange;
