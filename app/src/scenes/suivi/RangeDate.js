import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import logEvents from "../../services/logEvents";

import Text from "../../components/MyText";
import DateOrTimeDisplay from "./DateOrTimeDisplay";
import { SelectInput } from "../../components/SelectInput";
import { beforeToday } from "../../utils/date/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY_START_DATE } from "../../utils/constants";

const DateRange = ({ withPreset = false, ...props }) => {
  const [presetValue, setPresetValue] = useState("lastDays7");

  const [fromDate, setFromDate] = useState(props.fromDate);
  const [openFromDate, setOpenFromDate] = useState(false);

  const [toDate, setToDate] = useState(props.toDate);
  const [openToDate, setOpenToDate] = useState(false);

  useEffect(() => {
    (async () => {
      if (withPreset && presetValue !== "custom") {
        let _fromDate;
        let _toDate = beforeToday(0);
        switch (presetValue) {
          case "lastDays7":
            _fromDate = beforeToday(7);
            break;
          case "lastDays14":
            _fromDate = beforeToday(14);
            break;
          case "lastDays30":
            _fromDate = beforeToday(30);
            break;
          case "fromBeginning":
            const beginningDate = await AsyncStorage.getItem(STORAGE_KEY_START_DATE);
            _fromDate = new Date(beginningDate);
            break;
        }
        setFromDate(_fromDate);
        setToDate(_toDate);
        props.onChangeFromDate?.(_fromDate);
        props.onChangeToDate?.(_toDate);
      }
    })();
  }, [presetValue]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {withPreset && (
          <SelectInput
            placeholder="Sélectionnez une période..."
            value={presetValue}
            onValueChange={setPresetValue}
            items={[
              { label: "7 derniers jours", value: "lastDays7" },
              { label: "14 derniers jours", value: "lastDays14" },
              { label: "30 derniers jours", value: "lastDays30" },
              { label: "Depuis le début", value: "fromBeginning" },
              { label: "Choisir la période", value: "custom" },
            ]}
            containerStyle={{ marginBottom: 8 }}
          />
        )}

        <View style={styles.dateContainer}>
          <Text style={styles.text}>du</Text>
          <DateOrTimeDisplay
            mode="date"
            date={fromDate}
            onPress={() => {
              setOpenFromDate(true);
              logEvents.logSuiviEditDateFrom();
            }}
            disabled={withPreset && presetValue !== "custom"}
          />
          <Text style={styles.text}>au</Text>
          <DateOrTimeDisplay
            mode="date"
            date={toDate}
            onPress={() => {
              setOpenToDate(true);
              logEvents.logSuiviEditDateTo();
            }}
            disabled={withPreset && presetValue !== "custom"}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    padding: 5,
  },
});

export default DateRange;
