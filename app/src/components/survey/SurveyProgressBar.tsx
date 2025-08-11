import React from "react";
import { View, Text } from "react-native";

interface SurveyProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const SurveyProgressBar: React.FC<SurveyProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-4 py-3 bg-white">
      <Text className="text-sm text-gray-600 text-center mb-2">
        Étape {currentStep} sur {totalSteps}
      </Text>
      <View className="w-full h-2 bg-gray-200 rounded-full">
        <View className="h-2 bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </View>
    </View>
  );
};
