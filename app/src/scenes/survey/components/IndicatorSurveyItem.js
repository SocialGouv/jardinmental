import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { InputText } from "../../../components/InputText";

import { Smiley } from "./Smiley";
import Gauge from "../../../components/gauge";

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
        {/* <View style={[styles.emojisContainer]}>
          {emojis.map((emoji, i) => {
            const active = _value === emoji.score;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  const nextValue = emoji?.score;
                  _setValue(nextValue);
                  onValueChanged?.({ indicator, value: nextValue });
                }}
              >
                <View style={[styles.selectionContainer, active && styles.activeSelectionContainer]}>
                  <CircledIcon
                    color={emoji.backgroundColor}
                    borderColor={emoji.borderColor}
                    iconColor={emoji.iconColor}
                    icon={emoji.icon}
                    iconContainerStyle={{ marginRight: 0 }}
                    iconWidth={32}
                    iconHeight={32}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View> */}
        <InputText
          fill
          preset="lighten"
          placeholder="Ajoutez une note sur cet élément"
          value={_comment}
          onChangeText={(nextComment) => {
            _setComment(nextComment);
            onCommentChanged?.({ comment: nextComment, indicator });
          }}
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
    color: "#26387C",
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
    backgroundColor: "#1FC6D5",
  },
});
