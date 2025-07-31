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
import SmileyVeryGood from "@assets/svg/smileys/veryGood";
import SmileyGood from "@assets/svg/smileys/good";
import SmileyMiddle from "@assets/svg/smileys/middle";
import SmileyBad from "@assets/svg/smileys/bad";
import SmileyVeryBad from "@assets/svg/smileys/veryBad";

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
    VeryGoodSvg: SmileyVeryGood,
    GoodSvg: SmileyGood,
    MiddleSvg: SmileyMiddle,
    BadSvg: SmileyBad,
    VeryBadSvg: SmileyVeryBad,
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

export const BasicIcon = ({
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
      className="items-center p-2 rounded-2xl justify-center"
      style={{
        backgroundColor: color,
        width: 54,
        height: 70,
        borderWidth: borderWidth,
        borderColor,
      }}
    >
      <Icon width={iconWidth} height={iconHeight} color={iconColor} />
    </View>
  );
}


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

        width: iconWidth * 1.25,
        height: iconHeight * 1.25,
        borderRadius: iconWidth,
      }}
    >
      <Icon width={iconWidth} height={iconHeight} color={iconColor} />
    </View>
  );
};

export default CircledIcon;
