import React from "react";
import { Text } from "react-native";
import { OnboardingV2ScreenProps } from "../types";
import BeigeWrapperScreen from "../BeigeWrapperScreen";
import BeigeCard from "../BeigeCard";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { Typography } from "@/components/Typography";

type Props = OnboardingV2ScreenProps<"Intro">;

const OnboardingCheckInIntroductionCompleted: React.FC<Props> = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("OnboardingChooseIndicator");
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <BeigeWrapperScreen handleSkip={handleSkip} handlePrevious={handlePrevious} nextText="Continuer vers mon suivi" handleNext={handleNext}>
      <BeigeCard>
        <Typography className={mergeClassNames(typography.displayXsRegular, "text-cnam-primary-900 mb-8 px-12")}>
          Vous avez commencé votre suivi, bravo !
        </Typography>

        <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 text-center px-12")}>
          Pour aller plus loin, je vous propose quelques éléments à suivre régulièrement, en fonction de ce que vous avez partagé.
        </Typography>
      </BeigeCard>
    </BeigeWrapperScreen>
  );
};

export default OnboardingCheckInIntroductionCompleted;
