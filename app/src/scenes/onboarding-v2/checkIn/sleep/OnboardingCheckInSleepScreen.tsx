import React, { useCallback, useContext, useState } from "react";
import { View, Text } from "react-native";

import { OnboardingV2ScreenProps } from "../../types";
import { DiaryDataContext } from "@/context/diaryData";
import { beforeToday, formatDay } from "@/utils/date/helpers";
import { INDICATEURS_SOMMEIL } from "@/utils/liste_indicateurs.1";
import { generateIndicatorFromPredefinedIndicator } from "@/entities/Indicator";
import { TW_COLORS } from "@/utils/constants";
import { SafeAreaViewWithOptionalHeader } from "@/scenes/onboarding/ProgressHeader";
import BannerHeader from "../../BannerHeader";
import { useAnimatedStyle } from "react-native-reanimated";
import InstructionText from "../../InstructionText";
import Gauge from "@/components/gauge";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import MoonIcon from "@assets/svg/icon/moon";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import logEvents from "@/services/logEvents";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";

type Props = OnboardingV2ScreenProps<"OnboardingCheckInHowDoYouFeel">;

const moodLabels = [`J'ai très mal dormi`, `J'ai mal dormi`, "J’ai passé une nuit normale", `J'ai bien dormi`, `J'ai très bien dormi`];

const NextScreen = "CheckInSleepCompleted";

export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const [checkInData, setCheckInData] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);
  const { setCustomColor } = useStatusBar();

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);

      return () => {
        // Optional cleanup here
      };
    }, [])
  );

  const handleComplete = async () => {
    setLoading(true);
    logEvents.logSleepObdValidate();
    const date = formatDay(beforeToday(0));
    const prev = diaryData[date] || {};

    const key = INDICATEURS_SOMMEIL.uuid;
    const updatedAnswers = {
      ...prev,
      [key]: {
        ...prev[key],
        value: checkInData,
        _indicateur: generateIndicatorFromPredefinedIndicator(INDICATEURS_SOMMEIL),
      },
    };
    addNewEntryToDiaryData({
      date,
      answers: updatedAnswers,
    });
    navigation.navigate(NextScreen);
  };

  const handlePrevious = () => {
    logEvents.logOnboardingBack(12);
    navigation.goBack();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const onSelectValue = (value) => {
    setCheckInData(value);
  };

  const computeMoodLabel = (): string => {
    if (checkInData === null) return "";

    const index = Math.min(Math.floor(checkInData * 5), 4);
    return moodLabels[index] ?? "";
  };

  const renderSleepSelector = () => {
    return (
      <View className="p-4 py-6 rounded-xl bg-cnam-primary-50 border border-gray-400">
        <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900 mb-2")}>Qualité du sommeil</Text>
        <Gauge onChange={onSelectValue} reverse={undefined} />
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800")}>{computeMoodLabel()}</Text>
      </View>
    );
  };

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: TW_COLORS.PRIMARY,
    };
  });

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: "transparent",
      color: TW_COLORS.WHITE,
      textAlign: "left",
    };
  });

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeader
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        header={
          <View className="rounded-full bg-white/30 p-2 self-start w-auto border border-white">
            <MoonIcon />
          </View>
        }
        headerTitle="Observation du jour"
        title={`Cette nuit, avez-vous bien dormi ?`}
        handlePrevious={handlePrevious}
      ></BannerHeader>

      <View className="flex-1 p-6">
        <InstructionText>Évaluez la qualité de votre sommeil</InstructionText>
        {renderSleepSelector()}
      </View>
      <NavigationButtons loading={loading} onNext={handleComplete} onSkip={handleSkip} />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default CheckInScreen;
