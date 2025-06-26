import CheckInHeader from "@/components/onboarding/CheckInHeader";
import { ReactNode } from "react";
import { Platform, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";


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
        {Platform.OS === 'ios' && (
            <Animated.View style={[animatedStatusBarColor, { position: 'absolute', top: 0, left: 0, right: 0, height: 70, zIndex: 1000 }]} />
        )}
        <Animated.View
            style={[animatedStatusBarColor]}
            className="rounded-b-3xl py-4 pb-8 px-6"
        >
            <CheckInHeader
                title="Observation du jour"
                withMargin={false}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                showPrevious={true}
                animatedTextColor={animatedTextColor}
                showSkip={true}
            />
            <Animated.Text
                className="text-2xl font-bold text-left mt-8"
                style={[animatedTextColor]}
            >
                {title}
            </Animated.Text>
            {children}
        </Animated.View>
    </>
}