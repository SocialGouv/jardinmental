import React from "react";
import VeryGoodSvg from "../../assets/svg/veryGood.svg";
import GoodSvg from "../../assets/svg/good.svg";
import MiddleSvg from "../../assets/svg/middle.svg";
import BadSvg from "../../assets/svg/bad.svg";
import VeryBadSvg from "../../assets/svg/veryBad.svg";
import TodaySvg from "../../assets/svg/today.svg";
import YesterdaySvg from "../../assets/svg/yesterday.svg";
import NotesSvg from "../../assets/svg/notes.svg";
import DrugsSvg from "../../assets/svg/drugs.svg";
import HeartsSvg from "../../assets/svg/hearts.svg";
import PlusSvg from "../../assets/svg/plus-1.svg";
import QuestionMarkSvg from "../../assets/svg/QuestionMark.js";

import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "lightgrey",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
});

const mapIconToSvg = (icon) => {
  const iconMap = {
    VeryGoodSvg,
    GoodSvg,
    MiddleSvg,
    BadSvg,
    VeryBadSvg,
    TodaySvg,
    YesterdaySvg,
    NotesSvg,
    DrugsSvg,
    HeartsSvg,
    PlusSvg,
    QuestionMarkSvg,
  };
  return iconMap[icon];
};

const CircledIcon = ({
  icon,
  color,
  borderColor = "lightgrey",
  borderWidth = 1,
  iconColor = "black",
  opacity = 1,
  iconContainerStyle,
  iconWidth = 20,
  iconHeight = 20,
}) => {
  const Icon = mapIconToSvg(icon);
  return (
    <View
      style={{
        ...styles.iconContainer,
        backgroundColor: color,
        borderColor,
        borderWidth,
        opacity,
        ...iconContainerStyle,
      }}
    >
      <Icon width={iconWidth} height={iconHeight} color={iconColor} />
    </View>
  );
};

export default CircledIcon;
