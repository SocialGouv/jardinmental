import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import ArrowIcon from "@assets/svg/icon/Arrow";
import CheckMarkIcon from "@assets/svg/icon/check";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Typography } from "../Typography";

interface NavigationListItemProps {
  disabled?: false;
  icon: JSX.Element;
  label: string;
  onPress: () => any;
}

export default function NavigationListItem({ disabled, onPress, icon, label }: NavigationListItemProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={mergeClassNames("flex-row items-center px-4 py-6 mb-3 bg-white rounded-xl border border-gray-300", disabled ? "bg-success-bg" : "")}
    >
      {/* Left Icon */}
      <View
        className={`
          bg-cnam-cyan-50-lighten-90
          rounded-full p-2 border w-8 h-8 items-center justify-center`}
        style={{
          borderColor: disabled ? TW_COLORS.SUCCESS.TEXT : TW_COLORS.CNAM_PRIMARY_800,
        }}
      >
        {React.cloneElement(icon, {
          color: disabled ? TW_COLORS.SUCCESS.TEXT : TW_COLORS.CNAM_PRIMARY_800,
          width: 16,
          height: 16,
        })}
      </View>

      {/* Text */}
      <Typography
        className={mergeClassNames(`flex-1 ml-4 ${typography.textMdMedium} text-cnam-primary-950`, disabled ? "line-through text-mood-text-4" : "")}
      >
        {label}
      </Typography>

      {/* Right Arrow */}
      <View className="text-gray-400">{disabled ? <CheckMarkIcon color={TW_COLORS.SUCCESS.TEXT} /> : <ArrowIcon />}</View>
    </TouchableOpacity>
  );
}
