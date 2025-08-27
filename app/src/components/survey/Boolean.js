import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../MyText";
import { colors } from "@/utils/colors";
import ToggleButtons from "../ToggleButton";
import { TW_COLORS } from "@/utils/constants";

export const Boolean = ({ indicator, value, onChange, disabled }) => {
  const color = {
    ASC: {
      left: {
        bg: TW_COLORS.SUCCESS.BG_DARKEN,
        text: TW_COLORS.SUCCESS.TEXT,
      },
      right: {
        bg: TW_COLORS.ERROR.BG,
        text: TW_COLORS.ERROR.TEXT,
      },
    },
    DESC: {
      left: {
        bg: TW_COLORS.ERROR.BG,
        text: TW_COLORS.ERROR.TEXT,
      },
      right: {
        bg: TW_COLORS.SUCCESS.BG_DARKEN,
        text: TW_COLORS.SUCCESS.TEXT,
      },
    },
  };

  return (
    <ToggleButtons
      onPressLeft={() => {
        onChange(true);
      }}
      disabled={disabled}
      initialSelected={value}
      leftColor={color[indicator?.order].left.bg}
      rightColor={color[indicator?.order].right.bg}
      leftTextColor={color[indicator?.order].left.text}
      rightTextColor={color[indicator?.order].right.text}
      leftText={"Oui"}
      rightText={"Non"}
      onPressRight={() => {
        onChange(false);
        // if the user choose no, we clean the text input
      }}
    />
  );
};
