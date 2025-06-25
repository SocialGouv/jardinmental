import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { InputText } from "../InputText";

import { Smiley } from "@/components/survey/Smiley";
import { Boolean } from "./Boolean";
import Gauge from "../gauge";
import { colors } from "@/utils/colors";

export const IndicatorSurveyItem = ({
  indicator,
  index,
  value,
  onValueChanged,
  comment,
  onCommentChanged,
}) => {
  // console.log("✍️  i. ndicator", indicator);

  const [_comment, _setComment] = useState(comment);
  useEffect(() => {
    _setComment(comment);
  }, [comment]);

  const renderInput = () => {
    switch (indicator?.type) {
      case "smiley":
        return <Smiley indicator={indicator} value={value} onValueChanged={onValueChanged} />;
      case "boolean":
        return (
          <Boolean
            indicator={indicator}
            value={value}
            onChange={(v) => onValueChanged({ indicator, value: v })}
          />
        );
      case "gauge":
        return (
          <Gauge
            defaultValue={value}
            onChange={(v) => onValueChanged({ indicator, value: v })}
            reverse={indicator?.order === "DESC"}
          />
        );
      default:
        <View>
          <Text>pas encore geré</Text>
        </View>;
    }
    return (
      <View>
        <Text>pas encore geré</Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: value !== undefined ? "#F0FFF0" : "#F8F9FB",
          borderColor: value !== undefined ? "#D0E8D0" : "#E7EAF1",
        },
      ]}
    >
      <View style={[styles.contentContainer]}>
        <View style={[styles.topContainer]}>
          <Text style={[styles.label]}>{indicator.name}</Text>
        </View>
        {renderInput()}
        <InputText
          fill
          preset="lighten"
          placeholder="Ajoutez une note sur cet élément"
          value={_comment}
          onChangeText={(nextComment) => {
            _setComment(nextComment);
            onCommentChanged?.({ comment: nextComment, indicator });
          }}
          multiline={true}
          textAlignVertical="top"
          className="p-0" // remove space that multiline adds
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    marginVertical: 8,
  },
  contentContainer: {
    padding: 16,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    fontFamily: "Karla",
    fontWeight: "400",
    textAlign: "left",
    color: colors.BLUE,
    flexShrink: 1,
    marginLeft: 8,
    paddingTop: 3,
  },
  emojisContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  selectionContainer: {
    padding: 6,
    backgroundColor: "white",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 8,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
});
