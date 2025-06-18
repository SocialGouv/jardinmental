import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { NavigationButtonsProps } from '../types';
import { COLORS } from '../constants';

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onPrevious,
  onSkip,
  showPrevious = true,
  showSkip = false,
  nextDisabled = false,
  nextText = 'Suivant',
  skipText = 'Passer',
  loading = false
}) => {
  return (
    <View className="flex-row justify-between items-center p-6 px-6 bg-white">
      {/* {showPrevious ? (
        <TouchableOpacity 
          onPress={onPrevious} 
          className="px-4 py-2 rounded-lg"
          style={{ backgroundColor: 'transparent' }}
        >
          <Text 
            className="text-base font-medium"
            style={{ color: COLORS.GRAY_DARK }}
          >
            ← Précédent
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="px-4 py-2" />
      )}
      
      {showSkip && (
        <TouchableOpacity 
          onPress={onSkip} 
          className="px-4 py-2 rounded-lg"
          style={{ backgroundColor: 'transparent' }}
        >
          <Text 
            className="text-base font-medium"
            style={{ color: COLORS.SECONDARY }}
          >
            {skipText}
          </Text>
        </TouchableOpacity>
      )} */}
      
      <TouchableOpacity 
        onPress={onNext}
        disabled={nextDisabled || loading}
        className="px-6 py-3 rounded-lg items-center justify-center w-full"
        style={{ 
          backgroundColor: nextDisabled ? COLORS.GRAY_LIGHT : COLORS.PRIMARY,
          opacity: nextDisabled ? 0.6 : 1
        }}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.WHITE} size="small" />
        ) : (
          <Text 
            className="text-base font-semibold"
            style={{ color: COLORS.WHITE }}
          >
            {nextText}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
