import React, { useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import CheckInHeader from "../../components/onboarding/CheckInHeader";
import NavigationButtons from "../../components/onboarding/NavigationButtons";
import { TW_COLORS } from "@/utils/constants";
import BeigeWrapperScreen from "../onboarding-v2/BeigeWrapperScreen";
import BeigeCard from "../onboarding-v2/BeigeCard";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useOnboardingProgressHeader } from "../onboarding-v2/ProgressHeader";
import { useFocusEffect } from "@react-navigation/native";
import logEvents from "@/services/logEvents";
import { useStatusBar } from "@/context/StatusBarContext";
import { Typography } from "@/components/Typography";

interface EncouragementScreenProps {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  title?: string;
  description: string;
  headingTitle?: string;
  extraInfo?: string;
  nextText?: string;
  onNext: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
}

export const EncouragementScreen: React.FC<EncouragementScreenProps> = ({
  navigation,
  headingTitle,
  title,
  description,
  extraInfo,
  onNext,
  onSkip,
  onPrevious,
  nextText,
}) => {
  const { setSlideIndex } = useOnboardingProgressHeader();
  const { setCustomColor } = useStatusBar();

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setSlideIndex(-1);
      setCustomColor("#E5F6FC");
    }, [])
  );

  return (
    <BeigeWrapperScreen handlePrevious={onPrevious} handleSkip={onSkip} handleNext={onNext} nextText={nextText}>
      <BeigeCard color={TW_COLORS.CNAM_CYAN_LIGHTEN_80}>
        <View className="justify-center items-center w-full">
          <Typography className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-900 mb-8 text-left w-full")}>
            {headingTitle || `C'est noté 🌱`}
          </Typography>
          {title && (
            <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mb-8 text-left w-full")}>{title}</Typography>
          )}
        </View>
        {description && (
          <View className="pb-4 w-full">
            <Typography className={mergeClassNames(typography.textMdRegular, "text-center text-cnam-primary-900 text-left")}>
              {description}
            </Typography>
          </View>
        )}
        {extraInfo && (
          <View className="px-0 pb-4">
            <Typography className={mergeClassNames(typography.textMdRegular, "text-left text-gray-800 text-left")}>{extraInfo}</Typography>
          </View>
        )}
      </BeigeCard>
    </BeigeWrapperScreen>
  );
};
