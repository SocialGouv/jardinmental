import CheckInHeader from "@/components/onboarding/CheckInHeader";
import React, { ReactNode } from "react";
import { Platform, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import MonochromeLogo from "@assets/svg/illustrations/MonochromeLogo"
import { HEADER_WITH_BANNER, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from "@/utils/constants";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { firstLetterUppercase } from "@/utils/string-util";

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
    dynamicTitle,
    headerTitleStyle,
    dynamicTitleStyle,
    bannerContentStyle,
    bannerContainerStyle,
    titleMarginStyle,
    onBannerLayout,
    inAbsoluteView
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
    dynamicTitle?: string; // dynamic title that replaces header title on scroll
    headerTitleStyle?: Animated.AnimateStyle<ViewStyle>; // animated style for original header title
    dynamicTitleStyle?: Animated.AnimateStyle<ViewStyle>; // animated style for dynamic title
    bannerContentStyle?: Animated.AnimateStyle<ViewStyle>; // animated style for banner content
    bannerContainerStyle?: Animated.AnimateStyle<ViewStyle>; // animated style for banner container
    titleMarginStyle?: Animated.AnimateStyle<ViewStyle>; // animated style for title margin
    onBannerLayout?: (event: any) => void; // callback to measure banner height
    inAbsoluteView?: boolean
}) {
    return <>
        {Platform.OS === 'ios' && (
            <Animated.View style={[{
                backgroundColor: TW_COLORS.PRIMARY
            }, animatedStatusBarColor, { position: !inAbsoluteView ? 'absolute' : 'relative', top: 0, left: 0, right: 0, height: 65, zIndex: 1000 }, hidden ? { opacity: 0 } : undefined]} />
        )}
        <Animated.View
            style={[{
                backgroundColor: TW_COLORS.PRIMARY, borderWidth: 0,
            }, animatedStatusBarColor, hidden ? { opacity: 0 } : undefined]}
            className={`rounded-b-3xl ${(SHARED_HEADER || hideHeader) && !HEADER_WITH_BANNER ? 'pt-16' : ''}`}
        >
            {/* <MonochromeLogo style={{ position: 'absolute', top: -20, left: 0 }} /> */}
            {(!(SHARED_HEADER || hideHeader) || HEADER_WITH_BANNER) && <CheckInHeader
                title={headerTitle || ''}
                dynamicTitle={dynamicTitle}
                withMargin={false}
                onPrevious={handlePrevious}
                leftAction={leftAction}
                leftComponent={leftComponent}
                onSkip={handleSkip}
                showPrevious={true}
                animatedTextColor={animatedTextColor}
                showSkip={true}
                headerTitleStyle={headerTitleStyle}
                dynamicTitleStyle={dynamicTitleStyle}
            />}
            <Animated.View
                className={bannerContainerStyle ? "" : "py-4 pb-8 px-6"}
                style={[
                    bannerContainerStyle,
                    // Default padding when no animated style is provided
                    !bannerContainerStyle ? {
                        paddingVertical: 16,
                        paddingBottom: 32,
                        paddingHorizontal: 24,
                    } : {}
                ]}
                onLayout={onBannerLayout}
            >
                {header && <Animated.View style={bannerContentStyle}>{header}</Animated.View>}
                {title && <Animated.Text
                    className={mergeClassNames(typography.displayXsBold, 'mt-8 text-left')}
                    style={[{
                        color: TW_COLORS.WHITE
                    }, animatedTextColor, bannerContentStyle, titleMarginStyle]}
                >
                    {firstLetterUppercase(title)}
                </Animated.Text>}
                {children}
            </Animated.View>
        </Animated.View>
    </>
}
