import React from "react";
import { View, Text } from "react-native";
import { answers } from "../survey-v2/utils";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

type Item = { label: string; color: string };

export default function Legend({ className }: { className?: string }) {
  return (
    <View className={mergeClassNames("flex-row items-center space-x-2 p-4 mt-8", className)}>
      {answers.map((item, idx) => (
        <View key={idx} className="flex-row items-center space-x-1">
          <View className="h-4 w-4 rounded-full" style={{ backgroundColor: item.backgroundColor }} accessibilityLabel={`${item.label} couleur`} />
          <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-800")}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
