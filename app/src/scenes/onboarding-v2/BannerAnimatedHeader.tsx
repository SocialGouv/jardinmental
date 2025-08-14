import CheckInHeader from "@/components/onboarding/CheckInHeader";
import React, { ReactNode, useState, useEffect } from "react";
import { Platform, ViewStyle, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
import MonochromeLogo from "@assets/svg/illustrations/MonochromeLogo";
import { HEADER_WITH_BANNER, SHARED_HEADER } from "@/utils/constants";

export default function BannerHeader({
  animatedStatusBarColor,
  animatedTextColor,
  handlePrevious,
  handleSkip,
  title,
  children,
  header,
  enableHeightAnimation = true,
  animationConfig = { damping: 20, stiffness: 100 },
}: {
  animatedStatusBarColor?: Animated.AnimateStyle<ViewStyle>;
  animatedTextColor?: Animated.AnimateStyle<ViewStyle>;
  handlePrevious: () => void;
  handleSkip: () => void;
  title: string;
  header?: ReactNode;
  children?: ReactNode;
  enableHeightAnimation?: boolean;
  animationConfig?: { damping: number; stiffness: number };
}) {
  // Height animation state
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const animatedHeight = useSharedValue(0);

  // Update animated height when content height changes
  useEffect(() => {
    if (contentHeight > 0) {
      // if (isInitialRender) {
      //     // No animation on initial render
      //     animatedHeight.value = contentHeight;
      //     setIsInitialRender(false);
      // } else if (enableHeightAnimation) {
      // Animate height changes after initial render
      animatedHeight.value = withSpring(contentHeight, animationConfig);
      // } else {
      //     // No animation, just set the height
      //     animatedHeight.value = contentHeight;
      // }
    }
  }, [contentHeight, isInitialRender, enableHeightAnimation, animationConfig]);

  // Handle content layout measurement
  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height !== contentHeight) {
      runOnJS(setContentHeight)(height);
    }
  };

  // Animated style for height
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value > 0 ? animatedHeight.value : undefined,
      overflow: "hidden",
    };
  });

  return (
    <>
      {Platform.OS === "ios" && (
        <Animated.View style={[animatedStatusBarColor, { position: "absolute", top: 0, left: 0, right: 0, height: 70, zIndex: 1000 }]} />
      )}
      <Animated.View className={"rounded-b-3xl"} style={[animatedStatusBarColor, animatedContainerStyle]}>
        {/* Content measurement container */}
        <View onLayout={handleContentLayout} className={`py-4 pb-8 px-6 ${SHARED_HEADER && !HEADER_WITH_BANNER ? "pt-16" : ""}`}>
          {/* <MonochromeLogo style={{ position: 'absolute', top: -20, left: 0 }} /> */}
          {(!SHARED_HEADER || HEADER_WITH_BANNER) && (
            <CheckInHeader
              title="Observation du jour"
              withMargin={false}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              showPrevious={true}
              animatedTextColor={animatedTextColor}
              showSkip={true}
            />
          )}

          {header}
          <Animated.Text className="text-2xl font-bold text-left mt-8" style={[animatedTextColor]}>
            {title}
          </Animated.Text>
          {/* {children} */}
        </View>
      </Animated.View>
    </>
  );
}
