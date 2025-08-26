import React, { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Platform,
  Dimensions,
  // KeyboardAvoidingView
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import { Indicator, INDICATORS_CATEGORIES } from "@/entities/Indicator";
import { DiaryDataNewEntryInput } from "@/entities/DiaryData";
import { IndicatorSurveyItem } from "@/components/survey/IndicatorSurveyItem";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { TW_COLORS } from "@/utils/constants";
import BannerHeader from "../onboarding-v2/BannerHeader";
import MoonIcon from "@assets/svg/icon/moon";
import ThoughtIcon from "@assets/svg/icon/thought";
import BehaviourIcon from "@assets/svg/icon/behaviour";
import InstructionText from "../onboarding-v2/InstructionText";
import HelpText from "@/components/HelpText";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import HelpView from "@/components/HelpView";
import { HELP_FOR_CATEGORY, INDICATOR_CATEGORIES_DATA } from "../onboarding-v2/data/helperData";
import { firstLetterUppercase } from "@/utils/string-util";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";

interface IndicatorScreenProps {
  navigation: any;
  title: string;
  indicators: Indicator[];
  currentStep: number;
  totalSteps: number;
  answers: DiaryDataNewEntryInput["answers"];
  onValueChanged: ({ key, value }: { key: string; value: any }) => void;
  onCommentChanged: ({ key, userComment }: { key: string; userComment: string }) => void;
  onNext: () => void;
  category: NEW_INDICATORS_CATEGORIES;
  showComment?: boolean;
  hideNavigationButtonsInitially?: boolean;
}

const ICON_FOR_CATEGORY: Record<NEW_INDICATORS_CATEGORIES, React.ReactNode> = {
  [NEW_INDICATORS_CATEGORIES.SLEEP]: undefined,
  [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: undefined,
  [NEW_INDICATORS_CATEGORIES.WORK]: undefined,
  [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: undefined,
  [NEW_INDICATORS_CATEGORIES.EMOTIONS]: undefined,
  [NEW_INDICATORS_CATEGORIES.ENERGY]: undefined,
  [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: undefined,
  [NEW_INDICATORS_CATEGORIES.FOOD]: undefined,
  [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: undefined,
  [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: undefined,
  [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: undefined,
  [NEW_INDICATORS_CATEGORIES.COGNITIVE]: undefined,
};

export const IndicatorScreen: React.FC<IndicatorScreenProps> = ({
  navigation,
  title,
  indicators,
  answers,
  onValueChanged,
  onCommentChanged,
  onNext,
  category,
  showComment = true,
  hideNavigationButtonsInitially = true,
}) => {
  const { showBottomSheet } = useBottomSheet();
  const insets = useSafeAreaInsets();
  const [dynamicPaddingTop, setDynamicPaddingTop] = useState(0); // Default fallback

  const { setCustomColor } = useStatusBar();

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);
      return () => {
        // Optional cleanup here
      };
    }, [])
  );

  // Check if screen is large (like iPhone 16 Plus)
  const { height: screenHeight } = Dimensions.get("window");
  const isLargeScreen = screenHeight >= 900; // Threshold for large screens

  const onClickHelp = () => {
    if (category && HELP_FOR_CATEGORY[category]) {
      showBottomSheet(<HelpView description={HELP_FOR_CATEGORY[category].description} title={HELP_FOR_CATEGORY[category].title} />);
    }
  };
  // Scroll tracking
  const scrollY = useSharedValue(0);
  const measuredHeight = useSharedValue(0); // Store the measured natural height
  const SCROLL_THRESHOLD = 100; // Distance to scroll before full transition (reduced for more responsive animation)
  const NAVIGATION_BUTTONS_SCROLL_THRESHOLD = 50; // Distance to scroll before navigation buttons appear
  const buttonHasAppeared = useSharedValue(false); // Track if button has appeared

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Handle layout measurement to capture natural height
  const handleBannerLayout = (event) => {
    if (measuredHeight.value === 0) {
      // Only measure once
      measuredHeight.value = event.nativeEvent.layout.height;
      const bannerHeight = event.nativeEvent.layout.height;
      measuredHeight.value = bannerHeight;
      // Calculate total header height including safe area insets
      const totalHeaderHeight = bannerHeight + (Platform.OS === "android" ? insets.top + 20 : 50);
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
      [measuredHeight.value, 10], // From measured height to 0
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

    const paddingHorizontal = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [24, 0], // From px-6 (24px) to 0
      Extrapolate.CLAMP
    );

    return {
      height,
      paddingTop: paddingVertical,
      paddingBottom,
      paddingHorizontal,
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

  // Animated style for navigation buttons slide-up effect
  const navigationButtonsStyle = useAnimatedStyle(() => {
    // If hideNavigationButtonsInitially is false, always show the buttons
    if (!hideNavigationButtonsInitially) {
      return {
        transform: [{ translateY: 0 }],
      };
    }

    // Always show buttons on large screens (like iPhone 16 Plus)
    if (isLargeScreen) {
      return {
        transform: [{ translateY: 0 }],
      };
    }

    // Always show buttons if there's only one indicator
    if (indicators.length === 1) {
      buttonHasAppeared.value = true;
      return {
        transform: [{ translateY: 0 }],
      };
    }

    // Check if we've reached the threshold
    if (scrollY.value >= NAVIGATION_BUTTONS_SCROLL_THRESHOLD) {
      buttonHasAppeared.value = true;
    }

    // If button has appeared, keep it visible
    if (buttonHasAppeared.value) {
      return {
        transform: [{ translateY: 0 }],
      };
    }

    // Otherwise, animate based on scroll position
    const translateY = interpolate(
      scrollY.value,
      [0, NAVIGATION_BUTTONS_SCROLL_THRESHOLD],
      [100, 0], // Start 100px below screen, slide to normal position
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          headerTitle="Observation du jour"
          dynamicTitle={firstLetterUppercase(title)}
          header={
            category ? (
              <View className="rounded-full bg-white/30 p-2 self-start w-auto border border-white">
                {React.createElement(INDICATOR_CATEGORIES_DATA[category].icon, {
                  color: TW_COLORS.WHITE,
                })}
              </View>
            ) : null
          }
          title={title}
          // leftAction={category && HELP_FOR_CATEGORY[category] ? onClickHelp : null}
          // leftComponent={category && HELP_FOR_CATEGORY[category] ? <HelpText /> : null}
          handleSkip={onNext}
          // handlePrevious={() => navigation.goBack()}
          // animation on scroll
          handlePrevious={() => navigation.goBack()}
          headerTitleStyle={headerTitleStyle}
          dynamicTitleStyle={dynamicTitleStyle}
          bannerContentStyle={bannerContentStyle}
          bannerContainerStyle={bannerContainerStyle}
          titleMarginStyle={titleMarginStyle}
          onBannerLayout={handleBannerLayout}
        ></BannerHeader>
      </View>
      <KeyboardAvoidingView
        behavior={"padding"}
        // keyboardVerticalOffset={0}
        keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
        style={{
          flex: 1,
        }}
      >
        <Animated.ScrollView
          className={"flex-1"}
          contentContainerStyle={{
            paddingTop: dynamicPaddingTop,
            paddingBottom: 250,
          }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <View className="flex-1 justify-center items-center px-6 py-6">
            <InstructionText>
              Prenons un instant pour observer vos ressentis liés {INDICATOR_CATEGORIES_DATA[category].labelWithSecondPersonPrefix}
            </InstructionText>
            {indicators.map((indicator: Indicator, index) => (
              <IndicatorSurveyItem
                key={indicator.uuid}
                indicator={indicator}
                allIndicators={indicators}
                index={index}
                showComment={showComment}
                value={answers?.[indicator[indicator.diaryDataKey || "name"]]?.value}
                onValueChanged={({ indicator, value }) => {
                  onValueChanged({ key: indicator[indicator.diaryDataKey || "name"], value });
                }}
                onCommentChanged={({ indicator, comment }) =>
                  onCommentChanged({ key: indicator[indicator.diaryDataKey || "name"], userComment: comment })
                }
                comment={answers?.[indicator[indicator.diaryDataKey || "name"]]?.userComment}
              />
            ))}
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
      <Animated.View style={navigationButtonsStyle}>
        <NavigationButtons
          absolute={true}
          onNext={onNext}
          onLeftAction={category && HELP_FOR_CATEGORY[category] ? onClickHelp : undefined}
          // onPrevious={() => navigation.goBack()}
          showPrevious={false}
          // loading={loading}
          nextText="Suivant"
        />
      </Animated.View>
    </SafeAreaView>
  );
};
