import React, { useState } from "react";
import { View, Text, SafeAreaView, Platform, TouchableOpacity } from "react-native";
import { OnboardingV2ScreenProps } from "./types";
import { NavigationButtons } from "../../components/onboarding/NavigationButtons";
import { TW_COLORS } from "@/utils/constants";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import BannerHeaderIntro from "./BannerHeaderIntro";
import { SafeAreaViewWithOptionalHeader } from "../onboarding/ProgressHeader";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import logEvents from "@/services/logEvents";
import CheckBox from "@react-native-community/checkbox";

type Props = OnboardingV2ScreenProps<"Intro">;

const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const [isCguChecked, setIsCguChecked] = useState(false);

  const handleNext = () => {
    logEvents.logIntroObdNext();
    navigation.navigate("Carousel");
  };

  const onCguClick = () => {
    // Access the parent navigation to reach screens outside onboarding-v2
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate("cgu");
    }
  };

  const insets = useSafeAreaInsets();

  const [dynamicMarginTop, setDynamicMarginTop] = useState(0); // Default fallback
  const measuredHeight = useSharedValue(0); // Store the measured natural height

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: TW_COLORS.PRIMARY,
    };
  });

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: "transparent",
      color: TW_COLORS.WHITE,
      alignContent: "center",
      textAlign: "center",
    };
  });

  const handleBannerLayout = (event) => {
    if (measuredHeight.value === 0) {
      // Only measure once
      const bannerHeight = event.nativeEvent.layout.height;
      measuredHeight.value = bannerHeight;

      // Calculate total header height including safe area insets
      const totalHeaderHeight = bannerHeight + (Platform.OS === "android" ? insets.top : 0);
      setDynamicMarginTop(totalHeaderHeight);

      console.log("Banner height measured:", bannerHeight);
      console.log("Total header height (with insets):", totalHeaderHeight);
    }
  };

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeaderIntro
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        title={`Jardin Mental est un outil de suivi de votre santé mentale.`}
        handlePrevious={() => {}}
        handleSkip={() => {}}
        onBannerLayout={handleBannerLayout}
      />
      <View
        className="flex-1 justify-center items-center"
        style={{
          marginTop: dynamicMarginTop,
        }}
      >
        <View>
          <Text className={mergeClassNames(typography.textXlMedium, "text-primary")}>
            Gratuit à vie.{"\n"}
            Totalement anonyme.{"\n"}
            Sans inscription.
          </Text>
        </View>
        <View className="px-10 mt-12">
          <Text className={mergeClassNames(typography.textSmSemibold, "text-center")} style={{ color: TW_COLORS.SECONDARY }}>
            Créé avec des professionnels et{"\n"}soutenu par la CNAM
          </Text>
        </View>
      </View>

      <View className="px-6 pt-12">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={(newValue) => setIsCguChecked(!isCguChecked)}>
            {isCguChecked ? (
              <View className="mr-3 w-6 h-6 rounded-md items-center justify-center bg-cnam-primary-800">
                <Text className="text-white text-base font-bold">✓</Text>
              </View>
            ) : (
              <View className="mr-3 w-6 h-6 rounded-md items-center justify-center border-2 border-gray-300">
                <Text className="text-white text-xs" />
              </View>
            )}
          </TouchableOpacity>
          <View className="flex-1">
            <Text className={mergeClassNames(typography.textMdRegular, "text-left")} style={{ color: TW_COLORS.PRIMARY }}>
              En cochant cette case, vous acceptez les{" "}
              <TouchableOpacity onPress={onCguClick} style={{ alignSelf: "flex-start" }}>
                <Text className={mergeClassNames(typography.textMdRegular, "text-left underline")} style={{ color: TW_COLORS.PRIMARY }}>
                  conditions d'utilisation
                </Text>
              </TouchableOpacity>
              .
            </Text>
          </View>
        </View>
      </View>
      <NavigationButtons onNext={handleNext} showPrevious={false} nextText="Découvrir Jardin Mental" nextDisabled={!isCguChecked} />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default IntroScreen;
