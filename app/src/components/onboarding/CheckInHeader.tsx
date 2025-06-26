import { TW_COLORS } from '@/utils/constants';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

interface CheckInHeaderProps {
  title: string;
  onPrevious?: () => void;
  onSkip?: () => void;
  showPrevious?: boolean;
  showSkip?: boolean;
  skipText?: string;
  animatedTextColor?: Animated.AnimateStyle<ViewStyle>;
  withMargin?: boolean;
}

export const CheckInHeader: React.FC<CheckInHeaderProps> = ({
  title,
  onPrevious,
  onSkip,
  showPrevious = true,
  showSkip = false,
  skipText = 'Passer',
  animatedTextColor,
  withMargin = true
}) => {
  return (
    <View className={`justify-center items-center py-4 ${withMargin ? 'px-6' : ''}`} style={{ position: 'relative' }}>
      {/* Bouton Précédent */}
      {showPrevious && onPrevious ? (
        <TouchableOpacity
          onPress={onPrevious}
          className="px-3 py-2 rounded-lg"
          style={{
            position: 'absolute',
            left: withMargin ? 24 : 0,
            backgroundColor: 'transparent',
          }}
        >
          <Animated.Text className="text-base font-medium" style={[{ color: TW_COLORS.PRIMARY }, animatedTextColor]}>
            ←
          </Animated.Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            position: 'absolute',
            left: withMargin ? 24 : 0,
            width: 48, // même largeur que le bouton
            height: 40,
          }}
        />
      )}

      {/* Titre centré */}
      <Animated.Text
        numberOfLines={2}
        className="text-base text-center"
        style={[{ color: TW_COLORS.TEXT_PRIMARY }, animatedTextColor]}
      >
        {title}
      </Animated.Text>

      {/* Bouton Passer */}
      {showSkip && onSkip ? (
        <TouchableOpacity
          onPress={onSkip}
          className="px-3 py-2 rounded-lg"
          style={{
            position: 'absolute',
            right: withMargin ? 24 : 0,
            backgroundColor: 'transparent',
          }}
        >
          <Animated.Text className="text-base" style={[{ color: TW_COLORS.SECONDARY }, animatedTextColor]}>
            {skipText}
          </Animated.Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            position: 'absolute',
            right: withMargin ? 24 : 0,
            width: 48,
            height: 40,
          }}
        />
      )}
    </View>
  );
};

export default CheckInHeader;
