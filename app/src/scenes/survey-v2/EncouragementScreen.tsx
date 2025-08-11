import React, { useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import CheckInHeader from "../../components/onboarding/CheckInHeader";
import NavigationButtons from "../../components/onboarding/NavigationButtons";
import { TW_COLORS } from "@/utils/constants";
import BeigeWrapperScreen from "../onboarding-v2/BeigeWrapperScreen";
import BeigeCard from "../onboarding-v2/BeigeCard";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { useOnboardingProgressHeader } from "../onboarding/ProgressHeader";
import { useFocusEffect } from "@react-navigation/native";

interface EncouragementScreenProps {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  title?: string;
  description: string;
  headingTitle?: string;
  extraInfo?: string;
  onNext: () => void;
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
}) => {
  const { setSlideIndex } = useOnboardingProgressHeader();

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setSlideIndex(-1);
    }, [])
  );

  return (
    <BeigeWrapperScreen handlePrevious={() => navigation.goBack()} handleSkip={onSkip} handleNext={onNext}>
      <BeigeCard>
        <View className="justify-center items-center w-full">
          <Text className={mergeClassNames(typography.displayXsBold, "text-brand-950 mb-8 text-left w-full")}>{headingTitle || `C'est noté 🌱`}</Text>
          {title && <Text className={mergeClassNames(typography.textMdSemibold, "text-brand-900 mb-8 text-left w-full")}>{title}</Text>}
        </View>
        {description && (
          <View className="pb-4 w-full">
            <Text className={mergeClassNames(typography.textMdRegular, "text-center text-brand-900 text-left")}>{description}</Text>
          </View>
        )}
        {extraInfo && (
          <View className="px-0 pb-4">
            <Text className={mergeClassNames(typography.textMdRegular, "text-left text-gray-800 text-left")}>{extraInfo}</Text>
          </View>
        )}
      </BeigeCard>
    </BeigeWrapperScreen>
  );
};
