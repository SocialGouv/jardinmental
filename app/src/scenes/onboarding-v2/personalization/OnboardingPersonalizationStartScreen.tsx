import React, { useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import ProgressIndicator from "@/components/onboarding/ProgressIndicator";
import { OnboardingV2ScreenProps } from "../types";
import { HEADER_WITH_BANNER, PROGRESS_BAR, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from "@/utils/constants";
import { SafeAreaViewWithOptionalHeader, useOnboardingProgressHeader } from "@/scenes/onboarding/ProgressHeader";
import BannerHeader from "../BannerHeader";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import logEvents from "@/services/logEvents";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";

type Props = OnboardingV2ScreenProps<"Intro">;

const NextScreen = "PersonalizationDifficulties";

export const OnboardingPersonalizationStartScreen: React.FC<Props> = ({ navigation }) => {
  const { setNextCallback, setSkipCallback } = useOnboardingProgressHeader();
  const { setCustomColor } = useStatusBar();

  const handleNext = useCallback(() => {
    logEvents.logIndicatorObdStart();
    navigation.navigate(NextScreen);
  }, [navigation]);

  useEffect(() => {
    setSkipCallback(handleSkip);
    setNextCallback(handleNext);
  }, [handleNext]);

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);

      return () => {
        // Optional cleanup here
      };
    }, [])
  );

  const handlePrevious = () => {
    logEvents.logOnboardingBack(4);
    navigation.goBack();
  };

  const handleSkip = useCallback(() => {
    logEvents.logIndicatorObdPass(4);
    navigation.navigate("OnboardingChooseIndicator", {
      skippedScreen: "PersonalizationStart",
    });
  }, [navigation]);

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white" style={{}}>
      {
        <BannerHeader
          hidden={HEADER_WITH_BANNER}
          hideHeader={PROGRESS_BAR_AND_HEADER}
          header={SHARED_HEADER || PROGRESS_BAR || PROGRESS_BAR_AND_HEADER ? undefined : <ProgressIndicator currentStep={2} totalSteps={3} />}
          title={"Créons ensemble un suivi qui vous ressemble."}
          handleSkip={handleSkip}
          handlePrevious={handlePrevious}
        />
      }
      <View className="flex-1 justify-center items-center px-8">
        <Text className={mergeClassNames(typography.textXlMedium, "mb-8 text-cnam-primary-900 text-left")}>
          Commençons avec quelques questions simples, pour que le suivi vous ressemble vraiment.
        </Text>
        <Text className={mergeClassNames(typography.textMdMedium, "text-left")} style={{ color: TW_COLORS.TEXT_SECONDARY }}>
          {"\u2022"} ✅ Pas de bonne ou mauvaise réponse{"\n"}
          {"\u2022"} 🔄 Vos choix sont modifiables à tout moment{"\n"}
          {"\u2022"} 🧘 Avancez à votre rythme, sans pression{"\n"}
        </Text>
      </View>
      <NavigationButtons onNext={handleNext} showPrevious={false} withArrow={true} nextText="Créer mon suivi personnalisé" />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default OnboardingPersonalizationStartScreen;
