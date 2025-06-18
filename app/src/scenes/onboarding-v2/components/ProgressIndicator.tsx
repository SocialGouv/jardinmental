import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, TOTAL_STEPS } from '../constants';

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
    <View className="px-4 py-3 bg-white">
      {showText && (
        <Text 
          className="text-sm font-medium mb-2 text-center"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Étape {currentStep} sur {totalSteps}
        </Text>
      )}
      
      {/* Barre de progression */}
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
      
      {/* Indicateurs de points */}
      <View className="flex-row justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <View
              key={stepNumber}
              className="w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: isCompleted || isCurrent ? COLORS.PRIMARY : COLORS.WHITE,
                borderColor: isCompleted || isCurrent ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ProgressIndicator;
