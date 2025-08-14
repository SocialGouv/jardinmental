import CheckInHeader from "@/components/onboarding/CheckInHeader";
import React, { ReactNode } from "react";
import { Platform, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import MonochromeLogo from "@assets/svg/illustrations/MonochromeLogo";
import { typography } from "@/utils/typography";

export default function BannerHeaderIntro({
  animatedStatusBarColor,
  animatedTextColor,
  handlePrevious,
  handleSkip,
  title,
  children,
  onBannerLayout,
}: {
  animatedStatusBarColor?: Animated.AnimateStyle<ViewStyle>;
  animatedTextColor?: Animated.AnimateStyle<ViewStyle>;
  handlePrevious: () => void;
  handleSkip: () => void;
  title: string;
  children?: ReactNode;
  onBannerLayout?: (event: any) => void; // callback to measure banner height
}) {
  return (
    <>
      <Animated.View
        className={"items-center"}
        onLayout={onBannerLayout}
        style={[animatedStatusBarColor, { position: "absolute", top: 0, left: 0, right: 0, height: 260, zIndex: 1, overflow: "hidden" }]}
      >
        <MonochromeLogo
          width={"130%"}
          height={undefined}
          style={{
            position: "absolute",
            left: -30,
            top: "-30%",
          }}
        />
        <Animated.View
          style={[
            animatedStatusBarColor,
            {
              zIndex: 2,
              overflow: "hidden",
              backgroundColor: "transparent",
            },
          ]}
          className="py-4 pb-8 px-10 items-center h-full justify-center mt-8"
        >
          <Animated.Text className={typography.displayXsMedium} style={[animatedTextColor]}>
            {title}
          </Animated.Text>
          {children}
        </Animated.View>
      </Animated.View>
    </>
  );
}
