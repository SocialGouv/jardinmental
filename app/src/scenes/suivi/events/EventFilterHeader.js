import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import { displayedCategories } from "../../../utils/constants";
import { colors } from "../../../utils/colors";
import logEvents from "../../../services/logEvents";
import ScorePicker from "../ScorePicker";
import RangeDate from "../RangeDate";
import { SelectInput } from "../../../components/SelectInput";
import { EventInfoButton } from "./EventInfoButton";

export const EventFilterHeader = ({
  presetDate,
  setPresetDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  symptom,
  setSymptom,
  score,
  setScore,
  userIndicateurs,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={[styles.lineContainer]}>
          <Text style={[styles.text, { lineHeight: 22 }]}>
            Retrouvez toutes les notes que vous avez écrites les jours où :
          </Text>
        </View>
        <View style={[styles.lineContainer, styles.withSpace]}>
          <SelectSymptom
            options={userIndicateurs}
            onChange={setSymptom}
            onOpen={logEvents.logSuiviEditSymptom}
            placeholder="Sélectionner un élément"
            value={symptom}
            containerStyle={{ flex: 1 }}
          />
          <EventInfoButton containerStyle={{ marginLeft: 26 }} />
        </View>
        <View style={[styles.lineContainer, styles.withSpace]}>
          <Text style={[styles.text, { marginRight: 8 }]}>était</Text>
          <View style={[styles.scorePickerBorder]}>
            <ScorePicker
              size="small"
              focusedScores={score}
              onPress={(i) => {
                setScore([i]);
                logEvents.logSuiviEditScoreEvents(i);
              }}
            />
          </View>
        </View>
        <RangeDate
          presetValue={presetDate}
          onChangePresetValue={setPresetDate}
          fromDate={fromDate}
          toDate={toDate}
          onChangeFromDate={setFromDate}
          onChangeToDate={setToDate}
          withPreset={true}
          containerStyle={[styles.lineContainer, styles.withSpace]}
          contentContainerStyle={[{ flex: 1 }]}
          topContainerStyle={{
            flexDirection: "row-reverse",
            marginBottom: 10,
          }}
          selectInputProps={{
            containerStyle: {
              flex: 1,
            },
          }}
          dateOrTimeProps={{
            containerStyle: { flex: 1 },
            touchableStyle: { flex: 1 },
          }}
          textStyle={styles.text}
        >
          <Text style={[styles.text, { marginRight: 8 }]}>sur la période des</Text>
        </RangeDate>
      </View>
    </View>
  );
};

const SelectSymptom = ({
  value,
  placeholder,
  options = [],
  onChange = () => {},
  onOpen = () => {},
  ...props
}) => {
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 30,
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    paddingHorizontal: 10,
    flex: 1,
  },
  text: {
    color: colors.DARK_BLUE,
    fontSize: 16,
    textAlign: "left",
  },
});
