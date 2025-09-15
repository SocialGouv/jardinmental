import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import CircledIcon from "../../components/CircledIcon";
import { EMOTION_COLORS, TW_COLORS, scoresMapIcon } from "../../utils/constants";
import { getScoreWithState } from "../../utils";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";
import { DiaryDataAnswer, DiaryDataNewEntryInput, DiaryEntry } from "@/entities/DiaryData";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";

const PatientStateItem = ({ patientStateRecord, category, label }: { patientStateRecord: DiaryDataAnswer; category: string; label: string }) => {
  const [userCommentVisible, setUserCommentVisible] = useState(false);

  const isTouchable = () => !!patientStateRecord?.userComment?.trim();

  const renderResponse = () => {
    if (patientStateRecord?._indicateur?.type === "smiley") {
      let _icon;
      if (patientStateRecord?._indicateur?.order === "DESC") {
        _icon = scoresMapIcon[5 + 1 - patientStateRecord?.value];
      } else {
        _icon = scoresMapIcon[patientStateRecord?.value];
      }
      if (!_icon || (!_icon.color && !_icon.faceIcon))
        return <CircledIcon color="#cccccc" borderColor="#999999" iconColor="#888888" icon="QuestionMarkSvg" iconWidth={32} iconHeight={32} />;
      return (
        <CircledIcon
          color={_icon.color}
          borderColor={_icon.borderColor}
          iconColor={_icon.iconColor}
          icon={_icon.faceIcon}
          iconWidth={32}
          iconHeight={32}
        />
      );
    }
    if (patientStateRecord?._indicateur?.type === "boolean" || patientStateRecord?.value === true || patientStateRecord?.value === false) {
      const _color = {
        ASC: {
          false: { text: "text-red-border", bg: "border-red-border bg-red-bg" },
          true: { text: "text-green-border", bg: "border-green-border bg-green-bg" },
        },
        DESC: {
          true: { text: "text-red-border", bg: "border-red-border bg-red-bg" },
          false: { text: "text-green-border", bg: "border-green-border bg-green-bg" },
        },
      };

      const _value = patientStateRecord?.value;
      const _label = typeof _value === "boolean" && !_value ? "Non" : "Oui";

      return (
        <View
          className={`flex justify-center items-center h-10 w-10 mr-5 rounded-full ${_color[patientStateRecord?._indicateur?.order]?.[_value]?.bg}`}
        >
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700")}>{_label}</Text>
        </View>
      );
    }
    if (patientStateRecord?._indicateur?.type === "gauge") {
      const _value = patientStateRecord?.value;
      const _colors =
        patientStateRecord?._indicateur?.order === "DESC"
          ? [TW_COLORS.SUCCESS, EMOTION_COLORS.good, EMOTION_COLORS.middle, EMOTION_COLORS.bad, TW_COLORS.NEGATIVE]
          : [EMOTION_COLORS.veryBad, EMOTION_COLORS.bad, EMOTION_COLORS.middle, EMOTION_COLORS.good, EMOTION_COLORS.veryGood];

      let _color;
      if (_value < 0.2) _color = _colors[0];
      if (_value >= 0.2 && _value < 0.4) _color = _colors[1];
      if (_value >= 0.4 && _value < 0.6) _color = _colors[2];
      if (_value >= 0.6 && _value < 0.8) _color = _colors[3];
      if (_value >= 0.8) _color = _colors[4];
      return (
        <View className="flex flex-row justify-center w-10 space-x-2 items-end mr-5">
          <View className="h-2 rounded-full w-1" style={{ backgroundColor: _color }} />
          <View className="h-5 rounded-full w-1" style={{ backgroundColor: _color }} />
          <View className="h-8 rounded-full w-1" style={{ backgroundColor: _color }} />
        </View>
      );
    }
    return <View />;
  };

  const content = (
    <View>
      <View style={styles.container}>
        {renderResponse()}
        <View style={styles.labelContainer}>
          <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700")}>
            {label}
            {/* -{patientStateRecord?.value} */}
          </Text>
        </View>
        {isTouchable() ? (
          <Icon
            icon="ArrowUpSvg"
            color="#C7CED5"
            width={13}
            height={13}
            styleContainer={{
              width: 13,
              height: 13,
              transform: [{ rotate: userCommentVisible ? "0deg" : "180deg" }],
            }}
          />
        ) : null}
      </View>
      {userCommentVisible && isTouchable() ? (
        <View style={[styles.container, styles.tilt]}>
          <Text style={styles.userComment}>{patientStateRecord?.userComment?.trim()}</Text>
        </View>
      ) : null}
    </View>
  );

  if (isTouchable()) return <TouchableLayout onPress={() => setUserCommentVisible((e) => !e)}>{content}</TouchableLayout>;
  else return content;
};

const TouchableLayout = ({ children, onPress }) => {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  arrowDown: {
    transform: [{ rotate: "90deg" }],
  },
  arrowUp: {
    transform: [{ rotate: "270deg" }],
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    // paddingHorizontal: 20,
    // width: 32,
    // height: 32,
  },
  tilt: {
    // small negative marginTop for narrowing the texts
    marginTop: -15,
    // align the text with the symptom label
    // container's padding : 20
    // icon's marginRight: 20
    // icon's width : 40
    paddingLeft: 80, // 20 + 20 + 40 = 80
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
  },
  userComment: {
    flex: 1,
    fontSize: 14,
    color: colors.BLUE,
    fontStyle: "italic",
  },
  labelContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
});

export default PatientStateItem;
