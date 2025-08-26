import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Platform } from "react-native";
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
import { useOnboardingProgressHeader } from "../onboarding/ProgressHeader";
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
  hasProgressBar?: boolean;
  bottomComponent?: React.ReactNode;
  headerRightComponent?: React.ReactNode;
  headerRightAction?: () => void;
  hideBottomComponentInitially?: boolean;
  navigation: StackNavigationProp<any>;
  scrollViewBackground?: string;
  showBottomButton?: boolean;
  smallHeader?: boolean;
}

export const AnimatedHeaderScrollScreen: React.FC<IndicatorScreenProps> = ({
  title,
  onNext,
  category,
  children,
  dynamicTitle,
  hasProgressBar,
  headerTitle,
  bottomComponent,
  headerRightComponent,
  headerRightAction,
  showBottomButton = true,
  hideBottomComponentInitially = false,
  handlePrevious,
  navigation,
  scrollViewBackground,
  smallHeader,
}: IndicatorScreenProps) => {
  const { showBottomSheet } = useBottomSheet();
  const { setShowProgressbar, showProgressbar, setHideOnScrollProgressValue } = useOnboardingProgressHeader();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<Animated.ScrollView>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      setHideOnScrollProgressValue.value = 1;
    });

    return unsubscribe; // Clean up listener on unmount
  }, [navigation]);

  const onClickHelp = () => {
    if (category && HELP_FOR_CATEGORY[category]) {
      showBottomSheet(<HelpView description={HELP_FOR_CATEGORY[category].description} title={HELP_FOR_CATEGORY[category].title} />);
    }
  };
  // State for dynamic padding
  const [dynamicPaddingTop, setDynamicPaddingTop] = useState(0); // Default fallback

  // Scroll tracking
  const scrollY = useSharedValue(0);
  const measuredHeight = useSharedValue(0); // Store the measured natural height
  const SCROLL_THRESHOLD = 100; // Distance to scroll before full transition (reduced for more responsive animation)
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

      console.log("Banner height measured:", bannerHeight);
      console.log("Total header height (with insets):", totalHeaderHeight);
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
      [measuredHeight.value, 10], //hasProgressBar ? 40 : 10], // From measured height to 0
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
      [32, 0], // From pb-8 (32px) to 0
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
    paddingBottom: 250,
    flexGrow: 1,
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: scrollViewBackground || TW_COLORS.WHITE,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: Platform.OS === "android" ? insets.top : 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <BannerHeader
          inAbsoluteView={true}
          headerTitle={headerTitle}
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
          rightComponent={headerRightComponent}
          rightAction={headerRightAction}
          handlePrevious={handlePrevious}
          headerTitleStyle={headerTitleStyle}
          dynamicTitleStyle={dynamicTitleStyle}
          bannerContentStyle={bannerContentStyle}
          bannerContainerStyle={bannerContainerStyle}
          titleMarginStyle={titleMarginStyle}
          small={smallHeader}
          onBannerLayout={handleBannerLayout}
        ></BannerHeader>
      </View>
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0} style={{ flex: 1 }}>
        <Animated.ScrollView
          ref={scrollRef}
          className={"flex-1"}
          style={{
            backgroundColor: scrollViewBackground,
            paddingTop: Platform.OS === "android" ? insets.top : 0,
          }}
          contentContainerStyle={scrollViewContentStyle}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {children}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
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
