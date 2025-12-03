import React from "react";
import ToggleButtons from "../ToggleButton";
import { booleanColor } from "@/utils/constants";

export const Boolean = ({ indicator, value, onChange, disabled }) => {
  return (
    <ToggleButtons
      onPressLeft={() => {
        onChange(true);
      }}
      disabled={disabled}
      initialSelected={value}
      leftColor={booleanColor[indicator?.order].true.color}
      rightColor={booleanColor[indicator?.order].false.color}
      leftTextColor={booleanColor[indicator?.order].true.iconColor}
      rightTextColor={booleanColor[indicator?.order].false.iconColor}
      leftText={"Oui"}
      rightText={"Non"}
      onPressRight={() => {
        onChange(false);
        // if the user choose no, we clean the text input
      }}
    />
  );
};
