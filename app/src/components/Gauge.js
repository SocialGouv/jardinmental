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
  gaugeContainer: {},
  bar: {},
});

const Gauge = ({}) => {
  return (
    <View style={styles.gaugeContainer}>
      <View style={{ ...styles.bar, height: 10, backgroundColor: "#F16B6B" }} />
    </View>
  );
};

export default Gauge;
