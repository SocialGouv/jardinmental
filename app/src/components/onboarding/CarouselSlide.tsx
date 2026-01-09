import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { CarouselSlide as CarouselSlideType, CarouselSlideProps } from "@/scenes/onboarding-v2/types";
import { TW_COLORS } from "@/utils/constants";
import BeigeCard from "@/scenes/onboarding-v2/BeigeCard";
import { AvatarGroup } from "../AvatarGroup";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { VARIANT_BORDER_COLORS } from "@/scenes/onboarding-v2/data/carouselData";
import { Typography } from "../Typography";

const { width: screenWidth } = Dimensions.get("window");

export const CarouselSlide: React.FC<CarouselSlideProps> = ({ slide, isActive, onPress }) => {
  return (
    <BeigeCard
      style={{
        width: screenWidth,
        position: "relative",
        paddingTop: slide.illustration ? 100 : 0,
      }}
      bottomComponent={slide.bottomComponent}
      color={VARIANT_BORDER_COLORS[slide.variant || "beige"]}
    >
      {slide.illustration}

      <Typography className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-900 text-left")}>{slide.title}</Typography>

      {/* Description */}
      {slide.description && (
        <Typography
          className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left mt-10")}
          style={{
            maxWidth: screenWidth - 64,
          }}
        >
          {slide.description}
        </Typography>
      )}
      {slide.children}
    </BeigeCard>
  );
};
