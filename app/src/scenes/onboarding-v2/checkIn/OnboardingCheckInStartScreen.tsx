import React from "react";
import { Text } from "react-native";
import { OnboardingV2ScreenProps } from "../types";
import BeigeWrapperScreen from "../BeigeWrapperScreen";
import BeigeCard from "../BeigeCard";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import logEvents from "@/services/logEvents";
import { VARIANT_BORDER_COLORS, VARIANT_COLORS } from "../data/carouselData";
import { useFocusEffect } from "@react-navigation/native";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import { TW_COLORS } from "@/utils/constants";
type Props = OnboardingV2ScreenProps<"Intro">;

const NextRoute = "OnboardingCheckInHowDoYouFeel";

export const OnboardingCheckInStartScreen: React.FC<Props> = ({ navigation }) => {
  useFocusEffect(() => {
    setStatusBarBackgroundColor("#E5F6FC", false);
  });

  const handleNext = () => {
    logEvents.logHumeurObdStart();
    navigation.navigate(NextRoute);
  };

  const handlePrevious = () => {
    logEvents.logOnboardingBack(7);
    navigation.goBack();
  };

  return (
    <BeigeWrapperScreen
      // handleSkip={handleSkip}
      nextText="Commencer ma première observation"
      handlePrevious={handlePrevious}
      handleNext={handleNext}
      variant="blue"
    >
      <BeigeCard color={VARIANT_BORDER_COLORS.blue}>
        <Text className={mergeClassNames(typography.displayXsRegular, "text-left mb-6 text-cnam-primary-900")}>
          Un pas après l'autre, <Text className="font-bold">vous avancez déjà.</Text>
        </Text>

        <Text className={mergeClassNames(typography.textMdSemibold, "text-left text-cnam-primary-900")}>
          Réalisons ensemble votre première observation.
        </Text>
      </BeigeCard>
    </BeigeWrapperScreen>
  );
};

export default OnboardingCheckInStartScreen;
