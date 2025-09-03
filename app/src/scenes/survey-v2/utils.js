import { icons, EMOTION_COLORS as colorsFromConstant, iconBorderColors, iconColors } from "../../utils/constants";

export const answers = [
  {
    score: 1,
    backgroundColor: colorsFromConstant.veryBad,
    inactiveBackgroundColor: colorsFromConstant.veryBadTrans,
    iconColor: iconColors.veryBad,
    inactiveIconColor: "#666666",
    borderColor: iconBorderColors.veryBad,
    pressedBackgroundColor: "#ED76B3",
    icon: icons.veryBad,
    label: "très bas",
  },
  {
    score: 2,
    backgroundColor: colorsFromConstant.bad,
    inactiveBackgroundColor: colorsFromConstant.badTrans,
    iconColor: iconColors.bad,
    inactiveIconColor: "#666666",
    borderColor: iconBorderColors.bad,
    icon: icons.bad,
    pressedBackgroundColor: "#EC9588",
    label: "bas",
  },
  {
    score: 3,
    backgroundColor: colorsFromConstant.middle,
    inactiveBackgroundColor: colorsFromConstant.middleTrans,
    iconColor: iconColors.middle,
    inactiveIconColor: "#666666",
    borderColor: iconBorderColors.middle,
    icon: icons.middle,
    pressedBackgroundColor: "#F6D17B",
    label: "moyen",
  },
  {
    score: 4,
    backgroundColor: colorsFromConstant.good,
    inactiveBackgroundColor: colorsFromConstant.goodTrans,
    iconColor: iconColors.good,
    inactiveIconColor: "#666666",
    borderColor: iconBorderColors.good,
    icon: icons.good,
    pressedBackgroundColor: "#9ADAAA",
    label: "élévé",
  },
  {
    score: 5,
    backgroundColor: colorsFromConstant.veryGood,
    inactiveBackgroundColor: colorsFromConstant.veryGoodTrans,
    iconColor: iconColors.veryGood,
    inactiveIconColor: "#666666",
    borderColor: iconBorderColors.veryGood,
    icon: icons.veryGood,
    pressedBackgroundColor: "#66CDBB",
    label: "très élévé",
  },
];

export const answersYesNo = [
  {
    score: true,
    label: "Oui",
  },
  {
    score: false,
    label: "Non",
  },
];
