import React, { useEffect, useState } from "react";
import ReminderSettingSvg from "../../assets/svg/reminder-setting.svg";
import ExportDataSettingSvg from "../../assets/svg/export-data-setting.svg";
import ExportDataSvg from "../../assets/svg/export-data.svg";
import SymptomsSetting from "../../assets/svg/symptoms-setting.svg";
import CguSettingSvg from "../../assets/svg/cgu-setting.svg";
import DrugsSvg from "../../assets/svg/drugs.svg";
import InfoSvg from "../../assets/svg/info.svg";
import Info2Svg from "../../assets/svg/info2.svg";
import BurgerSvg from "../../assets/svg/burger.svg";
import PresentationSvg from "../../assets/svg/presentation.svg";
import NewsSvg from "../../assets/svg/news.svg";
import ProtectionSvg from "../../assets/svg/protection.svg";
import GearSvg from "../../assets/svg/Gear.js";
import PlusSvg from "../../assets/svg/plus.svg";
import Plus2Svg from "../../assets/svg/plus2.svg";
import ClockSvg from "../../assets/svg/clock.svg";
import LightBulbSvg from "../../assets/svg/light-bulb.svg";
import HeartsSvg from "../../assets/svg/hearts.svg";
import ThoughtsSvg from "../../assets/svg/thoughts.svg";
import CalendarSvg from "../../assets/svg/calendar.svg";
import Calendar2Svg from "../../assets/svg/calendar2.svg";
import ArrowUpSvg from "../../assets/svg/arrow-up.svg";
import PlusSurveySvg from "../../assets/svg/plus-survey.svg";
import PlusBeckSvg from "../../assets/svg/plus-beck.svg";
import CrossSvg from "../../assets/svg/cross.svg";
import ChevronUpSvg from "../../assets/svg/chevron-up.svg";
import ChevronDownSvg from "../../assets/svg/chevron-down.svg";
import ChevronRightSvg from "../../assets/svg/chevron-right.svg";
import BinSvg from "../../assets/svg/bin.svg";
import NotesSvg from "../../assets/svg/notes.svg";
import TuneSvg from "../../assets/svg/tune.svg";
import CheckSvg from "../../assets/svg/check.svg";
import Text from "../components/MyText";
import PhoneSvg from "../../assets/svg/Phone";
import PeopleSvg from "../../assets/svg/People";
import GlobeSvg from "../../assets/svg/Globe";
import LockSvg from "../../assets/svg/Lock";
import Arrow from "../../assets/svg/Arrow";
import ThumbsUpSvg from "../../assets/svg/thumbs-up.svg";
import ImportantSvg from "../../assets/svg/important.svg";
import EditSvg from "../../assets/svg/edit.svg";
import IndicateurSvg from "../../assets/svg/indicateur.svg";
import GoalSvg from "../../assets/svg/goal.svg";
import ReorderSvg from "../../assets/svg/reorder.svg";
import DeleteSvg from "../../assets/svg/delete.svg";

import { StyleSheet, View, Animated, Easing, TouchableOpacity } from "react-native";

const mapIconToSvg = (icon) => {
  const iconMap = {
    ReminderSettingSvg,
    ExportDataSettingSvg,
    SymptomsSetting,
    CguSettingSvg,
    DrugsSvg,
    InfoSvg,
    Info2Svg,
    BurgerSvg,
    PresentationSvg,
    NewsSvg,
    ProtectionSvg,
    GearSvg,
    ExportDataSvg,
    PlusSvg,
    Plus2Svg,
    ClockSvg,
    LightBulbSvg,
    HeartsSvg,
    CalendarSvg,
    Calendar2Svg,
    ArrowUpSvg,
    PlusSurveySvg,
    PlusBeckSvg,
    ThoughtsSvg,
    CrossSvg,
    BinSvg,
    NotesSvg,
    PhoneSvg,
    GlobeSvg,
    PeopleSvg,
    ChevronUpSvg,
    ChevronDownSvg,
    ChevronRightSvg,
    LockSvg,
    Arrow,
    ThumbsUpSvg,
    TuneSvg,
    CheckSvg,
    ImportantSvg,
    EditSvg,
    IndicateurSvg,
    GoalSvg,
    ReorderSvg,
    DeleteSvg,
  };
  return iconMap[icon];
};

const Icon = ({
  icon,
  color,
  styleContainer,
  spin,
  badge = false,
  onPress,
  activeOpacity = 0.4,
  ...props
}) => {
  const [spinFn, setSpinFn] = useState(null);

  useEffect(() => {
    if (spin === undefined) return;

    const spinValue = new Animated.Value(spin ? 0 : 1);

    Animated.timing(spinValue, {
      toValue: spin ? 1 : 0,
      duration: 200,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    }).start();

    setSpinFn(
      spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
      })
    );
  }, [spin]);

  const Icon = mapIconToSvg(icon);

  const render = () => (
    <Animated.View
      style={[styles.iconContainer, styleContainer, spinFn && { transform: [{ rotate: spinFn }] }]}
    >
      {badge ? <View style={styles.badge}>{/* <Text style={styles.badgeText}></Text> */}</View> : null}
      <Icon width={20} height={20} color={color || "black"} {...props} />
    </Animated.View>
  );

  return onPress ? (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
      {render()}
    </TouchableOpacity>
  ) : (
    render()
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    // borderColor: 'red',
    // borderWidth: 1,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // marginRight: 20,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: -5,
    backgroundColor: "#E46C76",
    borderRadius: 16,
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    zIndex: 2,
    width: 12,
    height: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
});

export default Icon;
