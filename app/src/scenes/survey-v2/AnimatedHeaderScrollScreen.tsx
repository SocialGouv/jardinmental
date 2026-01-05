import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Platform, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { Indicator } from "@/entities/Indicator";
import { DiaryDataNewEntryInput } from "@/entities/DiaryData";
import { IndicatorSurveyItem } from "@/components/survey/IndicatorSurveyItem";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { TW_COLORS } from "@/utils/constants";
import BannerHeader from "../onboarding-v2/BannerHeader";
import { useBottomSheet } from "@/context/BottomSheetContext";
import HelpView from "@/components/HelpView";
import { HELP_FOR_CATEGORY, INDICATOR_CATEGORIES_DATA, SECTION_ICONS } from "../onboarding-v2/data/helperData";
import { firstLetterUppercase } from "@/utils/string-util";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { useOnboardingProgressHeader } from "../onboarding-v2/ProgressHeader";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface IndicatorScreenProps {
  title: string;
  headerTitle?: string;
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  category?: NEW_INDICATORS_CATEGORIES | "GOAL" | "TREATMENT";
  handlePrevious?: () => void;
  children?: React.ReactNode;
  dynamicTitle?: string;
  subtitle?: string;
  hasProgressBar?: boolean;
  bottomComponent?: React.ReactNode;
  headerRightComponent?: React.ReactNode;
  headerRightAction?: () => void;
  headerLeftComponent?: React.ReactNode;
  hideBottomComponentInitially?: boolean;
  navigation: StackNavigationProp<any>;
  scrollViewBackground?: string;
  showBottomButton?: boolean;
  smallHeader?: boolean;
  animatedStatusBarColor?: Animated.AnimateStyle<ViewStyle>;
  animatedTextColor?: Animated.AnimateStyle<ViewStyle>;
  noPadding?: boolean;
  preserveScrollOnBlur?: boolean;
  onScrollPositionChange?: (scrollY: number) => void;
  initialScrollPosition?: number;
}

export const SCROLL_THRESHOLD = 100; // Distance to scroll before full transition (reduced for more responsive animation)

export const AnimatedHeaderScrollScreen: React.FC<IndicatorScreenProps> = ({
  title,
  onNext,
  category,
  children,
  dynamicTitle,
  hasProgressBar,
  headerTitle,
  subtitle,
  bottomComponent,
  headerRightComponent,
  headerLeftComponent,
  headerRightAction,
  showBottomButton = true,
  hideBottomComponentInitially = false,
  handlePrevious,
  navigation,
  scrollViewBackground,
  smallHeader,
  animatedStatusBarColor,
  animatedTextColor,
  noPadding,
  preserveScrollOnBlur = false,
  onScrollPositionChange,
  initialScrollPosition = 0,
}: IndicatorScreenProps) => {
  const { showBottomSheet } = useBottomSheet();
  const { setShowProgressbar, showProgressbar, setHideOnScrollProgressValue } = useOnboardingProgressHeader();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const hasRestoredScroll = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (!preserveScrollOnBlur) {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
        setHideOnScrollProgressValue.value = 1;
      }
    });

    return unsubscribe; // Clean up listener on unmount
  }, [navigation, preserveScrollOnBlur]);

  // Restore scroll position when component gains focus
  useFocusEffect(
    useCallback(() => {
      if (preserveScrollOnBlur && initialScrollPosition > 0 && !hasRestoredScroll.current) {
        // Use a small delay to ensure the screen has fully rendered
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            y: initialScrollPosition,
            animated: false,
          });
          hasRestoredScroll.current = true;
        }, 100);
      }

      return () => {
        // Reset the flag when leaving the screen
        hasRestoredScroll.current = false;
      };
    }, [preserveScrollOnBlur, initialScrollPosition])
  );

  const onClickHelp = () => {
    if (category && HELP_FOR_CATEGORY[category]) {
      showBottomSheet(<HelpView description={HELP_FOR_CATEGORY[category].description} title={HELP_FOR_CATEGORY[category].title} />);
    }
  };
  // State for dynamic padding
  const [dynamicPaddingTop, setDynamicPaddingTop] = useState(null); // Default fallback

  // Scroll tracking
  const scrollY = useSharedValue(0);
  const measuredHeight = useSharedValue(0); // Store the measured natural height
  const BOTTOM_COMPONENT_SCROLL_THRESHOLD = 50; // Distance to scroll before bottom component appears

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      const opacity = interpolate(
        scrollY.value,
        [0, 10],
        [1, 0], //hasProgressBar ? 40 : 10], // From measured height to 0
        Extrapolate.CLAMP
      );
      setHideOnScrollProgressValue.value = opacity;

      // Notify parent component of scroll position change if callback provided
      if (onScrollPositionChange) {
        runOnJS(onScrollPositionChange)(event.contentOffset.y);
      }
    },
  });

  // Handle layout measurement to capture natural height
  const handleBannerLayout = (event) => {
    if (measuredHeight.value === 0) {
      // Only measure once
      const bannerHeight = event.nativeEvent.layout.height;
      measuredHeight.value = bannerHeight;

      // Calculate total header height including safe area insets
      const totalHeaderHeight = bannerHeight + (Platform.OS === "android" ? insets.top : 50);
      setDynamicPaddingTop(totalHeaderHeight);
    }
  };

  // Animated styles for banner container (dynamic height animation)
  const bannerContainerStyle = useAnimatedStyle(() => {
    if (measuredHeight.value === 0) {
      // Before measurement, apply default padding
      return {
        paddingVertical: 16,
        paddingBottom: 32,
        paddingHorizontal: 24,
      };
    }

    const height = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [title ? measuredHeight.value : 10, 10], //hasProgressBar ? 40 : 10], // From measured height to 0
      Extrapolate.CLAMP
    );

    const paddingVertical = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [16, 0], // From py-4 (16px) to 0
      Extrapolate.CLAMP
    );

    const paddingBottom = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [title ? 32 : 0, 0], // From pb-8 (32px) to 0
      Extrapolate.CLAMP
    );

    return {
      height,
      paddingTop: paddingVertical,
      paddingBottom,
      paddingHorizontal: 24,
      minHeight: 0,
      overflow: "hidden", // Ensure content doesn't overflow during height animation
    };
  });

  // Animated styles for banner content (opacity only)
  const bannerContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [1, 0], Extrapolate.CLAMP);

    return {
      opacity,
    };
  });

  // Separate style for title margin animation
  const titleMarginStyle = useAnimatedStyle(() => {
    const marginTop = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [32, 0], // From mt-8 (32px) to 0
      Extrapolate.CLAMP
    );

    return {
      marginTop,
    };
  });

  // Animated styles for header title transition
  const headerTitleStyle = useAnimatedStyle(() => {
    const originalOpacity = interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [1, 0], Extrapolate.CLAMP);

    return {
      opacity: originalOpacity,
    };
  });

  const dynamicTitleStyle = useAnimatedStyle(() => {
    const dynamicOpacity = interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 1], Extrapolate.CLAMP);

    return {
      opacity: dynamicOpacity,
    };
  });

  // Animated style for bottom component slide-up effect
  const bottomComponentStyle = useAnimatedStyle(() => {
    // If hideBottomComponentInitially is false, always show the component
    if (!hideBottomComponentInitially) {
      return {
        transform: [{ translateY: 0 }],
      };
    }

    // Otherwise, apply the slide-up animation
    const translateY = interpolate(
      scrollY.value,
      [0, BOTTOM_COMPONENT_SCROLL_THRESHOLD],
      [100, 0], // Start 100px below screen, slide to normal position
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  // Dynamic content container style for ScrollView (regular style object)
  const scrollViewContentStyle = {
    paddingTop: dynamicPaddingTop,
    paddingBottom: noPadding ? 0 : 200,
    flexGrow: 1,
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={noPadding ? ["top", "left", "right"] : ["top", "left", "right", "bottom"]}
      style={{
        backgroundColor: scrollViewBackground || TW_COLORS.WHITE,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <BannerHeader
          inAbsoluteView={true}
          headerTitle={headerTitle}
          subtitle={subtitle}
          dynamicTitle={dynamicTitle || firstLetterUppercase(title)}
          header={
            category ? (
              <View className="rounded-full bg-white/30 p-2 self-start w-auto">
                {React.createElement(SECTION_ICONS[category].icon, {
                  color: TW_COLORS.WHITE,
                })}
              </View>
            ) : null
          }
          title={title}
          leftComponent={headerLeftComponent}
          rightComponent={headerRightComponent}
          rightAction={headerRightAction}
          handlePrevious={handlePrevious}
          headerTitleStyle={headerTitleStyle}
          dynamicTitleStyle={dynamicTitleStyle}
          bannerContentStyle={bannerContentStyle}
          bannerContainerStyle={bannerContainerStyle}
          titleMarginStyle={titleMarginStyle}
          small={smallHeader}
          animatedStatusBarColor={animatedStatusBarColor}
          animatedTextColor={animatedTextColor}
          onBannerLayout={handleBannerLayout}
        ></BannerHeader>
      </View>
      {dynamicPaddingTop !== null && (
        <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0} style={{ flex: 1 }}>
          <Animated.ScrollView
            ref={scrollRef}
            className={"flex-1"}
            style={{
              backgroundColor: scrollViewBackground,
              paddingTop: Platform.OS === "android" ? insets.top : 0,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={scrollViewContentStyle}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            automaticallyAdjustKeyboardInsets={true}
          >
            {children}
          </Animated.ScrollView>
        </KeyboardAvoidingView>
      )}
      {!bottomComponent && showBottomButton && (
        <NavigationButtons
          absolute={true}
          onNext={onNext}
          withArrow={true}
          onLeftAction={category && HELP_FOR_CATEGORY[category] ? onClickHelp : undefined}
          showPrevious={false}
          nextText="Suivant"
        />
      )}
      {bottomComponent && <Animated.View style={bottomComponentStyle}>{bottomComponent}</Animated.View>}
    </SafeAreaView>
  );
};
