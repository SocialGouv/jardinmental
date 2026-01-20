import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Typography } from "@/components/Typography";

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}

export const ToolFilterButton: React.FC<FilterButtonProps> = ({ label, selected, onPress, icon, ...props }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={mergeClassNames(
        "rounded-xl px-4 py-2 bg-white border flex-row items-center justify-center space-x-1",
        selected ? "border border-cnam-primary-800 bg-cnam-primary-800" : "border border-cnam-primary-800"
      )}
      {...props}
    >
      {icon}
      <Typography className={mergeClassNames(typography.textMdMedium, selected ? "text-white" : "text-cnam-primary-900")}>{label}</Typography>
    </TouchableOpacity>
  );
};
