import { colors } from "@/utils/colors";
import { TW_COLORS, TOTAL_STEPS } from "@/utils/constants";
import React from "react";
import { View, Text } from "react-native";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  showText?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps = TOTAL_STEPS, showText = true }) => {
  const progress = (currentStep / (totalSteps + 1)) * 100;

  return (
    <View className="px-8 py-0">
      <View className="flex-row items-center">
        <View className="h-2 rounded-full overflow-hidden flex-1" style={{ backgroundColor: TW_COLORS.GRAY_LIGHT }}>
          <View
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: TW_COLORS.LIGHT_COLORS,
              width: `${progress}%`,
            }}
          />
        </View>
        {showText && (
          <Text className="text-sm font-medium ml-2" style={{ color: TW_COLORS.WHITE }}>
            {currentStep}/{totalSteps}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProgressIndicator;
