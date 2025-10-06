import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import DatePicker from "react-native-date-picker";
import logEvents from "../../services/logEvents";

import DateOrTimeDisplay from "./DateOrTimeDisplay";
import { SelectInput } from "../../components/SelectInput";
import { beforeToday } from "../../utils/date/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HELP_ANALYSE, STORAGE_KEY_START_DATE } from "../../utils/constants";
import { Button2 } from "@/components/Button2";
import JMButton from "@/components/JMButton";
import HelpView from "@/components/HelpView";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

const RangeDate = ({
  withPreset = false,
  children,
  containerStyle,
  contentContainerStyle,
  topContainerStyle,
  textStyle,
  selectInputProps,
  setIsFilterActive,
  dateOrTimeProps,
  onHelpClick,
  introductionText,
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
  const { showBottomSheet } = useBottomSheet();

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
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-2">
          {introductionText && <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>{introductionText}</Text>}
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
          {!!setIsFilterActive && (
            <Button2
              checkable
              title="Filtrer"
              style={{
                height: 40,
              }}
              icon={"TuneSvg"}
              preset="secondary"
              size="small"
              containerStyle={{ marginHorizontal: 8 }}
              onPress={setIsFilterActive}
            />
          )}
        </View>
        {onHelpClick && <JMButton onPress={onHelpClick} variant="outline" width="fixed" icon={<CircleQuestionMark />} className="mr-2" />}
      </View>
      {presetValue === "custom" && (
        <View className="flex-row items-center mt-2 space-x-2">
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 mr-2")}>Du</Text>
          <DateOrTimeDisplay
            mode="date"
            date={fromDate}
            onPress={() => {
              setOpenFromDate(true);
              logEvents.logSuiviEditDateFrom();
            }}
            disabled={withPreset && presetValue !== "custom"}
            containerStyle={styles.dateItemContainer}
            {...dateOrTimeProps}
          />
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 mr-2")}>Au</Text>
          <DateOrTimeDisplay
            mode="date"
            date={toDate}
            onPress={() => {
              setOpenToDate(true);
              logEvents.logSuiviEditDateTo();
            }}
            disabled={withPreset && presetValue !== "custom"}
            containerStyle={styles.dateItemContainer}
            {...dateOrTimeProps}
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
              console.log("date", date);
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
      )}
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

export default RangeDate;
