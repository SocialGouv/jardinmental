import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { CarouselSlideProps } from '@/scenes/onboarding-v2/types';
import { TW_COLORS } from '@/utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const CarouselSlide: React.FC<CarouselSlideProps> = ({
  slide,
  isActive,
  onPress
}) => {
  return (
    <View 
      className="flex-1 justify-center items-center px-8"
      style={{ 
        width: screenWidth,
        backgroundColor: slide.backgroundColor || TW_COLORS.BACKGROUND,
      }}
    >
      {/* Illustration placeholder */}
      <View className="mb-8">
        {slide.illustration || (
          <View 
            className="w-32 h-32 rounded-full items-center justify-center"
            style={{ backgroundColor: TW_COLORS.PRIMARY + '20' }}
          >
            <Text className="text-4xl">
              {slide.type === 'special' ? '🎉' : '✨'}
            </Text>
          </View>
        )}
      </View>

      {/* Titre */}
      <Text 
        className="text-3xl font-bold text-center mb-6"
        style={{ 
          color: TW_COLORS.TEXT_PRIMARY,
          lineHeight: 40
        }}
      >
        {slide.title}
      </Text>

      {/* Description */}
      <Text 
        className="text-lg text-center leading-7"
        style={{ 
          color: TW_COLORS.TEXT_SECONDARY,
          maxWidth: screenWidth - 64
        }}
      >
        {slide.description}
      </Text>
    </View>
  );
};

export default CarouselSlide;
