import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../MyText";
import { colors } from "@/utils/colors";
import ToggleButtons from "../ToggleButton";
import { TW_COLORS } from "@/utils/constants";

export const Boolean = ({ indicator, value, onChange }) => {
  const color = {
    ASC: {
      left: TW_COLORS.SUCCESS,
      right: TW_COLORS.ERROR,
    },
    DESC: {
      left: TW_COLORS.ERROR,
      right: TW_COLORS.SUCCESS,
    },
  };

  return (
    <ToggleButtons
      onPressLeft={() => {
        onChange(false);
      }}
      initialSelected={value}
      leftColor={color[indicator?.order].left}
      rightColor={color[indicator?.order].right}
      leftText={"Oui"}
      rightText={"Non"}
      onPressRight={() => {
        onChange(true);
        // if the user choose no, we clean the text input
      }}
    />
  );
};
