import { TW_COLORS } from '@/utils/constants';
import React, { ReactNode } from 'react';
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
  animatedTextColor?: Animated.AnimateStyle<ViewStyle> | ViewStyle;
  withMargin?: boolean;
  className?: string;
  leftComponent?: ReactNode; // custom left component, used in shared header
  leftAction?: () => void;
}

export const CheckInHeader: React.FC<CheckInHeaderProps> = ({
  title,
  onPrevious,
  onSkip,
  showPrevious = true,
  showSkip = false,
  skipText = 'Passer',
  animatedTextColor,
  withMargin = true,
  className = '',
  leftAction,
  leftComponent
}) => {
  const horizontalPadding = withMargin ? 24 : 0;
  const headerHeight = 48; // 👈 fixed height ensures proper alignment

  return (
    <View
      className={'mx-4'}
      style={{
        height: headerHeight,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      {/* Bouton Précédent */}
      {
        (showPrevious && onPrevious) || leftAction ? (
          <TouchableOpacity
            onPress={leftAction || onPrevious}
            className="px-3 py-2 rounded-lg"
            style={{
              position: 'absolute',
              left: 0,
              // left: horizontalPadding,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            }}
          >
            <Animated.Text
              className="text-base font-medium"
              style={[{ color: TW_COLORS.WHITE }, animatedTextColor]}
            >
              {leftComponent ? leftComponent : '←'}
            </Animated.Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              position: 'absolute',
              left: 0,
              width: 48,
              height: headerHeight,
            }}
          />
        )
      }

      {/* Titre centré */}
      <Animated.Text
        numberOfLines={2}
        className="text-base text-center"
        style={[{ color: TW_COLORS.WHITE }, animatedTextColor]}
      >
        {title}
      </Animated.Text>

      {/* Bouton Passer */}
      {
        showSkip && onSkip ? (
          <TouchableOpacity
            onPress={onSkip}
            className="px-3 py-2 rounded-lg"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            }}
          >
            <Animated.Text
              className="text-base"
              style={[{ color: TW_COLORS.WHITE }, animatedTextColor]}
            >
              {skipText}
            </Animated.Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              position: 'absolute',
              right: 0,
              width: 48,
              height: headerHeight,
            }}
          />
        )
      }
    </View >
  );
};

export default CheckInHeader;
