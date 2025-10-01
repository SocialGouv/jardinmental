import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import logEvents from "../../services/logEvents";

import Text from "../../components/MyText";
import DateOrTimeDisplay from "./DateOrTimeDisplay";
import { SelectInput } from "../../components/SelectInput";
import { beforeToday } from "../../utils/date/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY_START_DATE } from "../../utils/constants";

const DateRange = ({
  withPreset = false,
  children,
  containerStyle,
  contentContainerStyle,
  topContainerStyle,
  textStyle,
  selectInputProps,
  dateOrTimeProps,
  ...props
}) => {
  const [presetValue, setPresetValue] = useState(props.presetValue || "lastDays7");
  useEffect(() => {
    if (presetValue !== props.presetValue) setPresetValue(props.presetValue);
  }, [props.presetValue]);

  const [fromDate, setFromDate] = useState(props.fromDate);
  useEffect(() => {
    if (fromDate !== props.fromDate) setFromDate(props.fromDate);
  }, [props.fromDate]);
  const [openFromDate, setOpenFromDate] = useState(false);

  const [toDate, setToDate] = useState(props.toDate);
  useEffect(() => {
    if (toDate !== props.toDate) setToDate(props.toDate);
  }, [props.toDate]);
  const [openToDate, setOpenToDate] = useState(false);

  // Modal state management to prevent conflicts
  const [isSelectModalActive, setIsSelectModalActive] = useState(false);
  const presetTimeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (presetTimeoutRef.current) {
      clearTimeout(presetTimeoutRef.current);
    }

    const handlePresetChange = async () => {
      props.onChangePresetValue?.(presetValue);
      if (withPreset && presetValue !== "custom") {
        // Set modal as active during preset change
        setIsSelectModalActive(true);

        let _fromDate;
        let _toDate = beforeToday(0);
        switch (presetValue) {
          case "lastDays7":
            _fromDate = beforeToday(7 - 1);
            break;
          case "lastDays14":
            _fromDate = beforeToday(14 - 1);
            break;
          case "lastDays30":
            _fromDate = beforeToday(30 - 1);
            break;
          case "fromBeginning":
            const beginningDate = await AsyncStorage.getItem(STORAGE_KEY_START_DATE);
            _fromDate = new Date(beginningDate);
            break;
        }

        // Add delay to ensure SelectInput modal is fully dismissed
        presetTimeoutRef.current = setTimeout(() => {
          setFromDate(_fromDate);
          setToDate(_toDate);
          setIsSelectModalActive(false);

          // Additional delay for parent component updates
          setTimeout(() => {
            props.onChangeFromDate?.(_fromDate);
            props.onChangeToDate?.(_toDate);
          }, 50);
        }, 300); // 300ms delay to ensure modal dismissal
      } else {
        setIsSelectModalActive(false);
      }
    };

    handlePresetChange();

    // Cleanup function
    return () => {
      if (presetTimeoutRef.current) {
        clearTimeout(presetTimeoutRef.current);
      }
    };
  }, [presetValue]);

  return (
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
      {...selectInputProps}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateItemContainer: {
    //marginHorizontal: 8,
  },
});

export default DateRange;
