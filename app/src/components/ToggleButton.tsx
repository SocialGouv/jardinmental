import { TW_COLORS } from "@/utils/constants";
import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

interface ToggleButtonsProps {
  leftColor?: string;
  rightColor?: string;
  leftTextColor?: string;
  rightTextColor?: string;
  rightText?: string;
  leftText?: string;
  onPressLeft: (value: boolean) => void;
  onPressRight: (value: boolean) => void;
  initialSelected?: boolean;
}

export default function ToggleButtons({
  initialSelected,
  leftColor,
  rightColor,
  leftTextColor,
  rightTextColor,
  rightText,
  leftText,
  onPressLeft,
  onPressRight,
}: ToggleButtonsProps) {
  const [selected, setSelected] = useState<boolean | undefined>(initialSelected);
  if (leftColor && rightColor) {
    return (
      <View className="flex-row rounded-lg border border-gray-300 self-start">
        <TouchableOpacity
          className={`p-3 items-center rounded-l-lg`}
          style={{
            backgroundColor: selected === true ? leftColor : TW_COLORS.WHITE,
          }}
          onPress={() => {
            onPressLeft?.(true);
            setSelected(true);
          }}
        >
          <Text 
            style={{
              color: selected === true ? (leftTextColor ? leftTextColor : 'white') : TW_COLORS.GRAY_800
            }}
            className={`font-medium`}
          >{leftText || "Oui"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`p-3 items-center rounded-r-lg border-l border-gray-300`}
          style={{
            backgroundColor: selected === false ? rightColor : TW_COLORS.WHITE,
          }}
          onPress={() => {
            onPressRight?.(false);
            setSelected(false);
          }}
        >
          <Text
            style={{
              color: selected === false ? (rightTextColor ? rightTextColor : 'white') : TW_COLORS.GRAY_800
            }}
            className={`font-medium`}>{rightText || "Non"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-row rounded-lg border border-gray-300 self-start">
      <TouchableOpacity
        className={`p-3 items-center ${selected === true ? "bg-brand-800" : "bg-white"} rounded-l-lg`}
        onPress={() => {
          onPressLeft?.(true);
          setSelected(true);
        }}
      >
        <Text className={`${selected === true ? "text-white" : "text-gray-800"} font-medium`}>{leftText || "Oui"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`p-3 items-center ${selected === false ? "bg-brand-800" : "bg-white"} rounded-r-lg border-l border-gray-300`}
        onPress={() => {
          onPressRight?.(false);
          setSelected(false);
        }}
      >
        <Text className={`${selected === false ? "text-white" : "text-gray-800"} font-medium`}>{rightText || "Non"}</Text>
      </TouchableOpacity>
    </View>
  );
}
