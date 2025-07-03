import CheckInHeader from "@/components/onboarding/CheckInHeader";
import React, { ReactNode } from "react";
import { Platform, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import MonochromeLogo from "@assets/svg/illustrations/MonochromeLogo"
import { typography } from "@/utils/typography";

export default function BannerHeader({
    animatedStatusBarColor,
    animatedTextColor,
    handlePrevious,
    handleSkip,
    title,
    children,
}: {
    animatedStatusBarColor?: Animated.AnimateStyle<ViewStyle>;
    animatedTextColor?: Animated.AnimateStyle<ViewStyle>;
    handlePrevious: () => void;
    handleSkip: () => void;
    title: string;
    children?: ReactNode;
}) {
    return <>
        <Animated.View
            className={"rounded-b-3xl"}
            style={[animatedStatusBarColor, { position: 'absolute', top: 0, left: 0, right: 0, height: 260, zIndex: 1, overflow: 'hidden' }]}>
            <MonochromeLogo
                width={'130%'}
                height={undefined}
                style={{
                    position: 'absolute',
                    left: -30,
                    top: '-30%'
                }}
            />
        </Animated.View>
        <Animated.View
            style={[animatedStatusBarColor, {
                zIndex: 2,
                overflow: 'hidden',
                backgroundColor: 'transparent'
            }]}
            className="rounded-b-3xl py-4 pb-8 px-10"
        >

            {/* <CheckInHeader
                title="Observation du jour"
                withMargin={false}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                showPrevious={true}
                animatedTextColor={animatedTextColor}
                showSkip={true}
            /> */}
            <Animated.Text
                className={typography.displayXsMedium}
                style={[animatedTextColor]}
            >
                {title}
            </Animated.Text>
            {children}
        </Animated.View>
    </>
}