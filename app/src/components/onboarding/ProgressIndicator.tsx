import { COLORS, TOTAL_STEPS } from '@/utils/constants';
import React from 'react';
import { View, Text } from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  showText?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = TOTAL_STEPS,
  showText = true
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-8 py-0 bg-white">
      {showText && (
        <Text 
          className="text-sm font-medium mb-2 text-center"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Étape {currentStep} sur {totalSteps}
        </Text>
      )}
      <View 
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: COLORS.GRAY_LIGHT }}
      >
        <View 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: COLORS.PRIMARY,
            width: `${progress}%`
          }}
        />
      </View>
    </View>
  );
};

export default ProgressIndicator;
