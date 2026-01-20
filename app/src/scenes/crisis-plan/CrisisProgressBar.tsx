import { TW_COLORS } from "@/utils/constants";
import { Animated, View, Text, Animated as RNAnimated } from "react-native";
import { useOnboardingProgressHeader } from "../onboarding-v2/ProgressHeader";
import { useEffect, useRef, useState } from "react";
import { Easing, useAnimatedStyle } from "react-native-reanimated";
import { Typography } from "@/components/Typography";

export default function CrisisProgressBar({ slideIndex = 1, slidesCount = 7 }) {
  const animatedProgressValue = useRef(new RNAnimated.Value(0)).current;
  const animatedProgressWidth = animatedProgressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    if (slideIndex >= 0) {
      RNAnimated.timing(animatedProgressValue, {
        toValue: Math.max(0, Math.min(1, slideIndex / slidesCount)),
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }, [slideIndex]);

  return (
    <Animated.View className="flex-row items-center px-4">
      <View
        className="h-2 rounded-full overflow-hidden flex-1"
        style={{ backgroundColor: TW_COLORS.CNAM_PRIMARY_50, borderColor: TW_COLORS.CNAM_PRIMARY_700, borderWidth: 1 }}
      >
        <RNAnimated.View
          className="h-full rounded-full transition-all duration-300"
          style={{
            backgroundColor: TW_COLORS.CNAM_CYAN_600_DARKEN_20,
            // borderColor: TW_COLORS.GRAY_LIGHT,
            width: animatedProgressWidth,
          }}
        />
      </View>
      <Typography className="text-sm font-medium ml-2" style={{ color: TW_COLORS.CNAM_PRIMARY_800 }}>
        {slideIndex}/{slidesCount}
      </Typography>
    </Animated.View>
  );
}
