import React, { useCallback } from "react";
import { View, Text } from "react-native";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { OnboardingV2ScreenProps } from "../../types";
import { TW_COLORS } from "@/utils/constants";
import { useAnimatedStyle } from "react-native-reanimated";
import { moodBackgroundColors, moodEmojis } from "@/utils/mood";
import BannerHeader from "../../BannerHeader";
import { SafeAreaViewWithOptionalHeader } from "@/scenes/onboarding/ProgressHeader";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { firstLetterUppercase } from "@/utils/string-util";
import { useStatusBar } from "@/context/StatusBarContext";
import { useFocusEffect } from "@react-navigation/native";

type Props = OnboardingV2ScreenProps<"OnboardingCheckInMoodSummary">;

export const OnboardingCheckInMoodSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { setCustomColor } = useStatusBar();

  useFocusEffect(
    useCallback(() => {
      if (route.params?.mood !== null) {
        setTimeout(() => {
          setCustomColor(moodBackgroundColors[route.params?.mood]);
        }, 0);
      }

      return () => {
        // Optional cleanup here
      };
    }, [route.params?.mood])
  );

  const handleNext = () => {
    navigation.navigate("OnboardingCheckInSleep");
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: route.params?.mood !== null ? moodBackgroundColors[route.params?.mood] : TW_COLORS.WHITE,
    };
  });

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: "transparent",
      color: TW_COLORS.PRIMARY,
      alignContent: "center",
      textAlign: "center",
    };
  });

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeader
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        headerTitle="Observation du jour"
        handlePrevious={handlePrevious}
        // handleSkip={handleSkip}
      >
        <View className="px-4 py-6 rounded-3xl bg-white w-full">
          <Text
            className={mergeClassNames(typography.displayXsRegular, "text-center mb-4 text-brand-950 font-bold")}
            style={{ color: TW_COLORS.TEXT_PRIMARY }}
          >
            Votre bilan d'aujourd'hui
          </Text>
          {route.params?.mood !== null && <View className="justify-center items-center mt-2">{moodEmojis[route.params?.mood]?.icon}</View>}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            {(route.params?.selectedMoods || []).map((mood, index) => (
              <View key={index} style={{ margin: 4 }}>
                <Tag
                  text={firstLetterUppercase(mood)}
                  bgcolor={route.params?.mood != null ? moodBackgroundColors[route.params?.mood] : TW_COLORS.WHITE}
                />
              </View>
            ))}
          </View>
        </View>
      </BannerHeader>
      <View className="flex-1 p-6">
        <View className="w-full">
          <Text className={mergeClassNames(typography.textXlSemibold, "text-brand-900 mb-6")}>Merci, c'est une première étape précieuse.</Text>
          <Text className={mergeClassNames(typography.textMdRegular, "text-gray-800 text-left")}>
            Observer votre humeur au fil du temps peut aider à mieux comprendre ce qui vous influence.
          </Text>
        </View>
      </View>

      <NavigationButtons
        onNext={handleNext}
        // onPrevious={handlePrevious}
        showPrevious={false}
        nextText="Passer au bilan sommeil"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export const Tag = ({ text, bgcolor }: { text: string; bgcolor: string }) => {
  return (
    <View
      className="p-2 px-4 rounded-full"
      style={{
        backgroundColor: bgcolor,
      }}
    >
      <Text className="text-xs text-center font-bold" style={{ color: TW_COLORS.TEXT_PRIMARY }}>
        {text}
      </Text>
    </View>
  );
};

export default OnboardingCheckInMoodSummaryScreen;
