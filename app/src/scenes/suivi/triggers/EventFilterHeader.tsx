import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { displayedCategories } from "../../../utils/constants";
import { colors } from "@/utils/colors";
import logEvents from "@/services/logEvents";
import ScorePicker from "../ScorePicker";
import RangeDate from "../RangeDate";
import { EventInfoButton } from "./EventInfoButton";
import { answers } from "../../survey-v2/utils";
import Legend from "../Legend";
import { SelectInput } from "@/components/SelectInput";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

export const EventFilterHeader = ({
  presetDate,
  setPresetDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  indicateur,
  setIndicateur,
  level,
  setLevel,
  userIndicateurs,
}) => {
  return (
    <View className="px-4 flex-col space-y-2">
      <View className="flex-row items-center justify-between">
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Voir les notes quand :</Text>
        <EventInfoButton containerStyle={{ marginLeft: 26 }} />
      </View>
      <View className="flex-row">
        <SelectSymptom
          options={userIndicateurs?.map(({ name }) => name)}
          onChange={setIndicateur}
          onOpen={logEvents.logSuiviEditSymptom}
          placeholder="Sélectionner un élément"
          value={indicateur}
        />
      </View>
      <View className="flex-row items-center space-x-2">
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>était</Text>
        <View style={[styles.scorePickerBorder]}>
          <ScorePicker
            size="small"
            focusedScores={level}
            onPress={(i) => {
              setLevel([i]);
              logEvents.logSuiviEditScoreEvents(i);
            }}
            showIcon={false}
            options={
              userIndicateurs?.find((ui) => ui.name === indicateur)?.type === "boolean"
                ? answers.filter((a) => a.score === 1 || a.score === 5)
                : answers
            }
          />
        </View>
      </View>
      <View className="flex-row items-center space-x-2">
        <RangeDate
          introductionText={"sur la période"}
          presetValue={presetDate}
          onChangePresetValue={setPresetDate}
          fromDate={fromDate}
          toDate={toDate}
          onChangeFromDate={setFromDate}
          onChangeToDate={setToDate}
          withPreset={true}
          containerStyle={[styles.lineContainer, styles.withSpace]}
        />
      </View>
      <Legend />
    </View>
  );
};

const SelectSymptom = ({ value, placeholder, options = [], onChange = () => {}, onOpen = () => {}, ...props }) => {
  const getTitle = (cat) => {
    const category = displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split("_");
    if (suffix && suffix === "FREQUENCE") {
      return categoryName;
    }
    return category;
  };

  return (
    <SelectInput
      placeholder={placeholder}
      value={value}
      onValueChange={onChange}
      items={options.map((o) => ({ label: getTitle(o), value: o })) || []}
      onOpen={onOpen}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "white",
    alignItems: "flex-start",
    maxWidth: 300,
  },
  lineContainer: {
    maxWidth: 360,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  withSpace: {
    marginTop: 10,
  },
  scorePickerBorder: {
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "flex-start",
    borderRadius: 30,
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    paddingHorizontal: 10,
    // flex: 1,
  },
  text: {
    color: colors.DARK_BLUE,
    fontSize: 16,
    textAlign: "left",
  },
});
