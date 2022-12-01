import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../../components/MyText";
import CircledIcon from "../../components/CircledIcon";
import { scoresMapIcon } from "../../utils/constants";
import { getScoreWithState } from "../../utils";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";

const PatientStateItem = ({ patientState, category, label }) => {
  // console.log("✍️  patientState", JSON.stringify(patientState, null, 2));
  const [{ color, borderColor, faceIcon, iconColor }, setIcon] = useState({});
  const [userCommentVisible, setUserCommentVisible] = useState(false);

  useEffect(() => {
    const score = getScoreWithState({ patientState, category });
    const icon = scoresMapIcon[score] || {};
    setIcon(icon);
  }, [patientState, category]);

  const isTouchable = () => !!patientState[category]?.userComment?.trim();

  const renderResponse = () => {
    if (patientState[category]?._indicateur?.type === "smiley") {
      let _icon;
      if (patientState[category]?._indicateur?.order === "DESC") {
        _icon = scoresMapIcon[5 + 1 - patientState[category]?.value];
      } else {
        _icon = scoresMapIcon[patientState[category]?.value];
      }
      if (!_icon.color && !_icon.faceIcon)
        return (
          <CircledIcon
            color="#cccccc"
            borderColor="#999999"
            iconColor="#888888"
            icon="QuestionMarkSvg"
            iconWidth={32}
            iconHeight={32}
          />
        );
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
    if (patientState[category]?._indicateur?.type === "boolean") {
      const _color = {
        ASC: {
          false: { text: "text-red-900", bg: "border-red-500 bg-red-500" },
          true: { text: "text-green-900", bg: "border-green-500 bg-green-500" },
        },
        DESC: {
          true: { text: "text-red-900", bg: "border-red-500 bg-red-500" },
          false: { text: "text-green-900", bg: "border-green-500 bg-green-500" },
        },
      };

      const _value = patientState[category]?.value;
      const _label = typeof _value === "boolean" && !_value ? "Non" : "Oui";

      return (
        <View
          className={`flex justify-center items-center h-10 w-10 mr-5 rounded-full ${
            _color[patientState[category]?._indicateur?.order]?.[_value].bg
          }`}
        >
          <Text className={_color[patientState[category]?._indicateur?.order]?.[_value].text}>{_label}</Text>
        </View>
      );
    }
    if (patientState[category]?._indicateur?.type === "gauge") {
      const _value = patientState[category]?.value;
      const _color =
        _value < 0.2
          ? "#F16B6B"
          : _value < 0.4
          ? "#FEAA5B"
          : _value < 0.6
          ? "#F2F478"
          : _value < 0.8
          ? "#ACF352"
          : "#5DEE5A";
      return (
        <View className="flex flex-row space-x-2 items-end mr-7">
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
          <Text style={styles.label}>{label}</Text>
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
          <Text style={styles.userComment}>{patientState[category]?.userComment?.trim()}</Text>
        </View>
      ) : null}
    </View>
  );

  if (isTouchable())
    return <TouchableLayout onPress={() => setUserCommentVisible((e) => !e)}>{content}</TouchableLayout>;
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
    paddingHorizontal: 20,
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
