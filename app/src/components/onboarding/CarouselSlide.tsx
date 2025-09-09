import React from "react";
import { View, Text, Dimensions } from "react-native";
import { CarouselSlideProps } from "@/scenes/onboarding-v2/types";
import { TW_COLORS } from "@/utils/constants";
import BeigeCard from "@/scenes/onboarding-v2/BeigeCard";
import { AvatarGroup } from "../AvatarGroup";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { VARIANT_BORDER_COLORS } from "@/scenes/onboarding-v2/data/carouselData";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const CarouselSlide: React.FC<CarouselSlideProps> = ({ slide, isActive, onPress }) => {
  return (
    <BeigeCard
      style={{
        width: screenWidth,
      }}
      color={VARIANT_BORDER_COLORS[slide.variant || "beige"]}
    >
      <Text className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-900 mb-10 text-left")}>{slide.title}</Text>

      {/* Description */}
      {slide.description && (
        <Text
          className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}
          style={{
            maxWidth: screenWidth - 64,
          }}
        >
          {slide.description}
        </Text>
      )}
      {slide.children}
    </BeigeCard>
  );
};

