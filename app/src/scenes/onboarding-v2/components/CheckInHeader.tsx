import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

interface CheckInHeaderProps {
  title: string;
  onPrevious?: () => void;
  onSkip?: () => void;
  showPrevious?: boolean;
  showSkip?: boolean;
  skipText?: string;
}

export const CheckInHeader: React.FC<CheckInHeaderProps> = ({
  title,
  onPrevious,
  onSkip,
  showPrevious = true,
  showSkip = false,
  skipText = 'Passer'
}) => {
  return (
    <View className="flex-row justify-between items-center px-6 py-4 bg-white">
      {/* Bouton Précédent */}
      {showPrevious && onPrevious ? (
        <TouchableOpacity 
          onPress={onPrevious} 
          className="px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'transparent' }}
        >
          <Text 
            className="text-base font-medium"
            style={{ color: COLORS.PRIMARY }}
          >
            ←
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="px-3 py-2" />
      )}

      {/* Titre */}
      <Text 
        className="text-lg font-bold text-center flex-1 mx-4"
        style={{ color: COLORS.TEXT_PRIMARY }}
        numberOfLines={2}
      >
        {title}
      </Text>

      {/* Bouton Passer */}
      {showSkip && onSkip ? (
        <TouchableOpacity 
          onPress={onSkip} 
          className="px-3 py-2 rounded-lg"
          style={{ backgroundColor: 'transparent' }}
        >
          <Text 
            className="text-base font-medium"
            style={{ color: COLORS.SECONDARY }}
          >
            {skipText}
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="px-3 py-2" />
      )}
    </View>
  );
};

export default CheckInHeader;
