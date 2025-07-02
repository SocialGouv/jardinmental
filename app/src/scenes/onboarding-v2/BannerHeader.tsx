import CheckInHeader from "@/components/onboarding/CheckInHeader";
import React, { ReactNode } from "react";
import { Platform, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import MonochromeLogo from "@assets/svg/illustrations/MonochromeLogo"
import { HEADER_WITH_BANNER, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from "@/utils/constants";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export default function BannerHeader({
    animatedStatusBarColor,
    animatedTextColor,
    handlePrevious,
    handleSkip,
    title,
    children,
    header,
    hidden,
    headerTitle,
    leftComponent,
    leftAction,
    hideHeader = false, // temporary variable to hide headers
}: {
    animatedStatusBarColor?: Animated.AnimateStyle<ViewStyle>;
    animatedTextColor?: Animated.AnimateStyle<ViewStyle>;
    handlePrevious: () => void;
    handleSkip?: () => void;
    title?: string;
    header?: ReactNode;
    children?: ReactNode;
    hidden?: boolean // temp variable to hide headers
    headerTitle?: string; // title for the header, used in shared header
    leftComponent?: ReactNode; // custom left component, used in shared header
    leftAction?: () => void; // custom left action, used in shared header
    hideHeader?: boolean; // temporary variable to hide headers
}) {
    return <>
        {Platform.OS === 'ios' && (
            <Animated.View style={[{
                backgroundColor: TW_COLORS.PRIMARY
            }, animatedStatusBarColor, { position: 'absolute', top: 0, left: 0, right: 0, height: 60, zIndex: 1000 }, hidden ? { opacity: 0 } : undefined]} />
        )}
        <Animated.View
            style={[{
                backgroundColor: TW_COLORS.PRIMARY
            }, animatedStatusBarColor, hidden ? { opacity: 0 } : undefined]}
            className={`rounded-b-3xl ${(SHARED_HEADER || hideHeader) && !HEADER_WITH_BANNER ? 'pt-16' : ''}`}
        >
            {/* <MonochromeLogo style={{ position: 'absolute', top: -20, left: 0 }} /> */}
            {(!(SHARED_HEADER || hideHeader) || HEADER_WITH_BANNER) && <CheckInHeader
                title={headerTitle || ''}
                withMargin={false}
                onPrevious={handlePrevious}
                leftAction={leftAction}
                leftComponent={leftComponent}
                onSkip={handleSkip}
                showPrevious={true}
                animatedTextColor={animatedTextColor}
                showSkip={true}
            />}
            <View className="py-4 pb-8 px-6">
                {header}
                {title && <Animated.Text
                    className="text-2xl font-bold text-left mt-8"
                    style={[{
                        color: TW_COLORS.WHITE
                    }, animatedTextColor]}
                >
                    {title}
                </Animated.Text>}
                {children}
            </View>
        </Animated.View>
    </>
}