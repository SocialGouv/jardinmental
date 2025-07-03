import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { CarouselSlideProps } from '@/scenes/onboarding-v2/types';
import { TW_COLORS } from '@/utils/constants';
import BeigeCard from '@/scenes/onboarding-v2/BeigeCard';
import { AvatarGroup } from '../AvatarGroup';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const CarouselSlide: React.FC<CarouselSlideProps> = ({
  slide,
  isActive,
  onPress
}) => {
  return (
    <BeigeCard
      style={{
        width: screenWidth,
      }}
    >
      <Text
        className={mergeClassNames(typography.displayXsBold, 'text-brand-950 mb-10')}
        style={{
          color: TW_COLORS.TEXT_PRIMARY,
        }}
      >
        {slide.title}
      </Text>

      {/* Description */}
      {slide.description && <Text
        className={mergeClassNames(typography.textMdRegular, 'text-brand-900 px-6')}
        style={{
          maxWidth: screenWidth - 64
        }}
      >
        {slide.description}
      </Text>}
      {slide.children}
    </BeigeCard>
  );
};

export default CarouselSlide;
