import React from "react";
import { Text } from "react-native";
import { OnboardingV2ScreenProps } from "../types";
import BeigeWrapperScreen from "../BeigeWrapperScreen";
import BeigeCard from "../BeigeCard";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
type Props = OnboardingV2ScreenProps<"Intro">;

const NextRoute = "OnboardingCheckInHowDoYouFeel";

export const OnboardingCheckInStartScreen: React.FC<Props> = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate(NextRoute);
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <BeigeWrapperScreen
      // handleSkip={handleSkip}
      nextText="Commencer ma première observation"
      handlePrevious={handlePrevious}
      handleNext={handleNext}
    >
      <BeigeCard>
        <Text className={mergeClassNames(typography.displayXsRegular, "text-left mb-6 text-brand-950")}>
          Un pas après l'autre, <Text className="font-bold">vous avancez déjà.</Text>
        </Text>

        <Text className={mergeClassNames(typography.textMdSemibold, "text-left text-brand-900")}>Réalisons ensemble votre première observation.</Text>
      </BeigeCard>
    </BeigeWrapperScreen>
  );
};

export default OnboardingCheckInStartScreen;
